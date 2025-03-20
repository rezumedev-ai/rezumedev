
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

// Define very permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Log every request
  console.log("WEBHOOK REQUEST RECEIVED:");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Log all headers
  console.log("Headers:");
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Responding to OPTIONS request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === 'POST') {
      console.log("Processing POST request");
      
      // Get the raw request body as text
      const body = await req.text();
      console.log("Request body length:", body.length);
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      console.log("Stripe signature present:", !!signature);
      
      if (!signature) {
        console.error('Missing stripe-signature header');
        // Still return 200 to avoid Stripe retries
        return new Response(
          JSON.stringify({ error: 'Missing stripe-signature header' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        console.error('Missing webhook secret in environment variables');
        return new Response(
          JSON.stringify({ error: 'Server configuration error: Missing webhook secret' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Verify the event
      let event;
      try {
        console.log("Verifying webhook signature...");
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log(`Event verified successfully: ${event.type}`);
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(
          JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle the event based on its type
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

    // For GET requests, return a simple success message
    if (req.method === 'GET') {
      console.log("Responding to GET request");
      return new Response(
        JSON.stringify({ status: "Webhook endpoint is working" }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If not OPTIONS, POST or GET, return method not allowed but with 200 status
    console.log(`Method ${req.method} not supported but returning 200`);
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed`, status: "ok" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 200, // Still return 200 to avoid Stripe retries
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
