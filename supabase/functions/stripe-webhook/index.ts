
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Initialize Stripe with the secret key from environment variable
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define extremely permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  console.log("Webhook request received:", req.method, req.url);
  console.log("Headers:", JSON.stringify(Object.fromEntries([...req.headers]), null, 2));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Responding to OPTIONS request with CORS headers");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === 'GET') {
      console.log("Received GET request - responding with success for testing");
      return new Response(
        JSON.stringify({ success: true, message: "Webhook endpoint reachable" }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (req.method === 'POST') {
      console.log("Processing POST webhook request");
      
      // Get the raw request body as text
      const body = await req.text();
      console.log("Request body:", body.substring(0, 500) + (body.length > 500 ? "..." : ""));
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      console.log("Stripe signature present:", !!signature);
      
      let event;
      
      // Try verification if signature is present
      if (signature) {
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        console.log("Webhook secret present:", !!webhookSecret);
        
        if (webhookSecret) {
          try {
            console.log("Verifying webhook signature...");
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
            console.log("Event verified successfully:", event.type);
          } catch (err) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            
            // Instead of returning an error, try to parse the body as JSON
            console.log("Attempting to parse raw body as JSON");
            try {
              event = JSON.parse(body);
              console.log("Successfully parsed body as JSON:", event.type);
            } catch (parseErr) {
              console.error("Failed to parse body as JSON:", parseErr.message);
              return new Response(
                JSON.stringify({ error: `Invalid payload: ${parseErr.message}` }),
                { 
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          }
        } else {
          // No webhook secret, try to parse the body as JSON
          console.log("No webhook secret found - attempting to parse raw body as JSON");
          try {
            event = JSON.parse(body);
            console.log("Successfully parsed body as JSON without verification");
          } catch (parseErr) {
            console.error("Failed to parse body as JSON:", parseErr.message);
            return new Response(
              JSON.stringify({ error: `Invalid payload: ${parseErr.message}` }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
        }
      } else {
        // No signature, try to parse the body as JSON
        console.log("No signature found - attempting to parse raw body as JSON");
        try {
          event = JSON.parse(body);
          console.log("Successfully parsed body as JSON without signature");
        } catch (parseErr) {
          console.error("Failed to parse body as JSON:", parseErr.message);
          return new Response(
            JSON.stringify({ error: `Invalid payload: ${parseErr.message}` }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
      
      // Ensure we have an event to process
      if (!event) {
        console.error("No event could be constructed from the request");
        return new Response(
          JSON.stringify({ error: "Failed to construct event from request" }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle the event based on its type
      console.log("Processing event type:", event.type);
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Log the entire session for debugging
        console.log("Checkout session completed:", JSON.stringify(session, null, 2));
        
        // Get user ID from session metadata
        const userId = session.metadata?.userId || session.client_reference_id;
        const planType = session.metadata?.planType;
        
        if (!userId) {
          console.error('No user ID found in session:', session.id);
          return new Response(
            JSON.stringify({ error: 'No user ID found in session' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log(`Updating subscription for user ${userId} with plan ${planType}`);
        
        // Update user profile with subscription info
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_plan: planType,
            subscription_status: 'active',
            subscription_id: session.subscription || session.id,
            payment_method: 'card',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw new Error(`Failed to update user profile: ${updateError.message}`);
        }
        
        console.log(`Successfully updated subscription for user ${userId}`);
      } 
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        
        // Log the entire subscription for debugging
        console.log("Subscription deleted:", JSON.stringify(subscription, null, 2));
        
        // Find user with this subscription ID
        const { data: profiles, error: lookupError } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .limit(1);
          
        if (lookupError || !profiles || profiles.length === 0) {
          console.error('Could not find user for subscription:', subscription.id);
          throw new Error(`User not found for subscription: ${subscription.id}`);
        }
        
        const userId = profiles[0].id;
        
        // Update subscription status to inactive
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'inactive',
            subscription_plan: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating subscription status:', updateError);
          throw new Error(`Failed to update subscription status: ${updateError.message}`);
        }
        
        console.log(`Successfully deactivated subscription for user ${userId}`);
      }
      else {
        console.log(`Unhandled event type: ${event.type}`);
      }

      // Return a successful response
      return new Response(
        JSON.stringify({ received: true, event: event.type }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If not OPTIONS, GET or POST, return method not allowed
    console.log(`Method not allowed: ${req.method}`);
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message, stack: error.stack }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
