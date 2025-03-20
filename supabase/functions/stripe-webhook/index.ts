
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Define permissive CORS headers - this is crucial for Stripe webhooks
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

// Initialize Supabase client with service role for admin access
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log prefixes for better visibility
const LOG_PREFIX = {
  INFO: "🔵 INFO:",
  ERROR: "🔴 ERROR:",
  SUCCESS: "✅ SUCCESS:",
  WEBHOOK: "🪝 WEBHOOK:",
};

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    console.log(`${LOG_PREFIX.INFO} Webhook received: ${req.method} ${url.pathname}`);
    
    // Handle CORS preflight requests first
    if (req.method === 'OPTIONS') {
      console.log(`${LOG_PREFIX.INFO} CORS preflight request`);
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Health check endpoint for testing webhook connectivity
    if (req.method === 'GET') {
      console.log(`${LOG_PREFIX.INFO} Health check requested`);
      return new Response(
        JSON.stringify({ 
          status: 'healthy', 
          message: 'Stripe webhook endpoint is operational'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (req.method === 'POST') {
      console.log(`${LOG_PREFIX.WEBHOOK} Processing webhook request`);
      
      // Log all request headers for debugging
      const headersObj = {};
      req.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      console.log(`${LOG_PREFIX.INFO} Request headers:`, JSON.stringify(headersObj, null, 2));
      
      // Get the raw request body as text
      const body = await req.text();
      console.log(`${LOG_PREFIX.INFO} Request body length: ${body.length} characters`);
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      
      if (!signature) {
        console.error(`${LOG_PREFIX.ERROR} Missing stripe-signature header`);
        return new Response(
          JSON.stringify({ error: 'Missing stripe-signature header' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log(`${LOG_PREFIX.INFO} Signature found: ${signature.substring(0, 20)}...`);
      
      // Get the webhook secret
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      
      if (!webhookSecret) {
        console.error(`${LOG_PREFIX.ERROR} Missing webhook secret in environment variables`);
        return new Response(
          JSON.stringify({ error: `Server configuration error: Missing webhook secret` }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Get the Stripe API key - we'll always use the same key
      const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
      
      if (!stripeSecretKey) {
        console.error(`${LOG_PREFIX.ERROR} Missing Stripe secret key`);
        return new Response(
          JSON.stringify({ error: `Server configuration error: Missing Stripe secret key` }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Initialize Stripe
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });

      // Verify the event
      let event;
      try {
        console.log(`${LOG_PREFIX.INFO} Verifying webhook signature...`);
        // Use the async version as suggested in the error message
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        console.log(`${LOG_PREFIX.SUCCESS} Event verified successfully: ${event.type}`);
      } catch (err) {
        console.error(`${LOG_PREFIX.ERROR} Webhook signature verification failed: ${err.message}`);
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
        
        console.log(`${LOG_PREFIX.WEBHOOK} Updating subscription for user ${userId} with plan ${planType}`);
        
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
      else if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        console.log(`${LOG_PREFIX.WEBHOOK} Subscription updated:`, JSON.stringify(subscription, null, 2));
        
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
        const status = subscription.status;
        
        // Update subscription status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error(`${LOG_PREFIX.ERROR} Error updating subscription status:`, updateError);
          throw new Error(`Failed to update subscription status: ${updateError.message}`);
        }
        
        console.log(`${LOG_PREFIX.SUCCESS} Successfully updated subscription status to ${status} for user ${userId}`);
      }
      else {
        console.log(`${LOG_PREFIX.INFO} Unhandled event type: ${event.type}`);
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
