
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

// Define permissive CORS headers - this is crucial for Stripe webhooks
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
};

// Log prefixes with emojis for better visibility
const LOG_PREFIX = {
  INFO: "🔵 INFO:",
  ERROR: "🔴 ERROR:",
  SUCCESS: "✅ SUCCESS:",
  WARNING: "⚠️ WARNING:",
  WEBHOOK: "🪝 WEBHOOK:",
};

Deno.serve(async (req) => {
  console.log(`${LOG_PREFIX.INFO} Webhook received: ${req.method} ${new URL(req.url).pathname}`);
  
  // Health check endpoint for testing webhook connectivity
  if (req.method === 'GET') {
    console.log(`${LOG_PREFIX.INFO} Health check requested`);
    return new Response(
      JSON.stringify({ status: 'healthy', message: 'Stripe webhook endpoint is operational' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`${LOG_PREFIX.INFO} CORS preflight request`);
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === 'POST') {
      console.log(`${LOG_PREFIX.WEBHOOK} Processing webhook request`);
      
      // Get the raw request body as text
      const body = await req.text();
      console.log(`${LOG_PREFIX.INFO} Request body length: ${body.length} characters`);
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      
      if (!signature) {
        console.error(`${LOG_PREFIX.ERROR} Missing stripe-signature header`);
        console.log(`${LOG_PREFIX.INFO} Available headers:`, Object.fromEntries([...req.headers.entries()]));
        return new Response(
          JSON.stringify({ error: 'Missing stripe-signature header' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log(`${LOG_PREFIX.INFO} Signature found: ${signature.substring(0, 20)}...`);

      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        console.error(`${LOG_PREFIX.ERROR} Missing webhook secret in environment variables`);
        return new Response(
          JSON.stringify({ error: 'Server configuration error: Missing webhook secret' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Verify the event
      let event;
      try {
        console.log(`${LOG_PREFIX.INFO} Verifying webhook signature...`);
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log(`${LOG_PREFIX.SUCCESS} Event verified successfully: ${event.type}`);
      } catch (err) {
        console.error(`${LOG_PREFIX.ERROR} Webhook signature verification failed: ${err.message}`);
        
        // Log more details about the verification failure
        console.log(`${LOG_PREFIX.INFO} Webhook Secret (first 4 chars): ${webhookSecret.substring(0, 4)}...`);
        console.log(`${LOG_PREFIX.INFO} Body preview (first 100 chars): ${body.substring(0, 100)}...`);
        
        return new Response(
          JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle the event based on its type
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Log the entire session for debugging
        console.log(`${LOG_PREFIX.WEBHOOK} Checkout session completed:`, JSON.stringify(session, null, 2));
        
        // Get user ID from session metadata
        const userId = session.metadata?.userId || session.client_reference_id;
        const planType = session.metadata?.planType;
        
        if (!userId) {
          console.error(`${LOG_PREFIX.ERROR} No user ID found in session:`, session.id);
          return new Response(
            JSON.stringify({ error: 'No user ID found in session' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log(`${LOG_PREFIX.INFO} Updating subscription for user ${userId} with plan ${planType}`);
        
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
          console.error(`${LOG_PREFIX.ERROR} Error updating profile:`, updateError);
          throw new Error(`Failed to update user profile: ${updateError.message}`);
        }
        
        console.log(`${LOG_PREFIX.SUCCESS} Successfully updated subscription for user ${userId}`);
      } 
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        
        // Log the entire subscription for debugging
        console.log(`${LOG_PREFIX.WEBHOOK} Subscription deleted:`, JSON.stringify(subscription, null, 2));
        
        // Find user with this subscription ID
        const { data: profiles, error: lookupError } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .limit(1);
          
        if (lookupError || !profiles || profiles.length === 0) {
          console.error(`${LOG_PREFIX.ERROR} Could not find user for subscription:`, subscription.id);
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
          console.error(`${LOG_PREFIX.ERROR} Error updating subscription status:`, updateError);
          throw new Error(`Failed to update subscription status: ${updateError.message}`);
        }
        
        console.log(`${LOG_PREFIX.SUCCESS} Successfully deactivated subscription for user ${userId}`);
      }
      else {
        console.log(`${LOG_PREFIX.WARNING} Unhandled event type: ${event.type}`);
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
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error(`${LOG_PREFIX.ERROR} Unexpected error:`, error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
