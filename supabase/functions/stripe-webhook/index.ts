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
  LIVE: "🔴 LIVE:",
  TEST: "🟡 TEST:",
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

      // First try to parse the event body to check if it's livemode
      let rawEvent;
      try {
        rawEvent = JSON.parse(body);
        console.log(`${LOG_PREFIX.INFO} Raw event livemode:`, rawEvent.livemode);
      } catch (parseErr) {
        console.error(`${LOG_PREFIX.ERROR} Failed to parse event JSON for livemode check:`, parseErr);
        rawEvent = { livemode: false }; // Default to test mode if we can't parse
      }
      
      // Determine if this is a live mode webhook based on the event data
      const isLiveMode = rawEvent.livemode === true;
      console.log(`${LOG_PREFIX.INFO} Event is in ${isLiveMode ? 'LIVE' : 'TEST'} mode based on event data`);
      
      // Select the appropriate webhook secret based on mode
      const webhookSecret = isLiveMode 
        ? Deno.env.get('STRIPE_LIVE_WEBHOOK_SECRET')
        : Deno.env.get('STRIPE_WEBHOOK_SECRET');
      
      if (!webhookSecret) {
        console.error(`${LOG_PREFIX.ERROR} Missing ${isLiveMode ? 'live' : 'test'} webhook secret in environment variables`);
        return new Response(
          JSON.stringify({ error: `Server configuration error: Missing ${isLiveMode ? 'live' : 'test'} webhook secret` }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Log the webhook secret being used (first few characters for debugging only)
      const secretPrefix = webhookSecret.substring(0, 10);
      console.log(`${LOG_PREFIX.INFO} Using webhook secret: ${secretPrefix}... for ${isLiveMode ? 'LIVE' : 'TEST'} mode`);
      
      // Get the appropriate Stripe secret key based on mode
      const stripeSecretKey = isLiveMode
        ? Deno.env.get('STRIPE_LIVE_SECRET_KEY')
        : Deno.env.get('STRIPE_SECRET_KEY');
        
      if (!stripeSecretKey) {
        console.error(`${LOG_PREFIX.ERROR} Missing ${isLiveMode ? 'live' : 'test'} Stripe secret key`);
        return new Response(
          JSON.stringify({ error: `Server configuration error: Missing ${isLiveMode ? 'live' : 'test'} Stripe secret key` }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Initialize Stripe with the appropriate secret key
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });

      // Log mode for debugging
      console.log(`${isLiveMode ? LOG_PREFIX.LIVE : LOG_PREFIX.TEST} Processing webhook in ${isLiveMode ? 'LIVE' : 'TEST'} mode`);

      // Verify the event
      let event;
      try {
        console.log(`${LOG_PREFIX.INFO} Verifying webhook signature with secret starting with ${secretPrefix}...`);
        // Use the async version as suggested in the error message
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        console.log(`${LOG_PREFIX.SUCCESS} Event verified successfully: ${event.type}`);
      } catch (err) {
        console.error(`${LOG_PREFIX.ERROR} Webhook signature verification failed: ${err.message}`);
        return new Response(
          JSON.stringify({ 
            error: `Webhook signature verification failed: ${err.message}`,
            mode: isLiveMode ? 'live' : 'test',
            secretUsed: secretPrefix + '...'
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Confirm the event's livemode matches our detection
      if (event.livemode !== isLiveMode) {
        console.error(`${LOG_PREFIX.ERROR} Event livemode (${event.livemode}) doesn't match detected mode (${isLiveMode})`);
      }

      // Handle the event based on its type
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Log the entire session for debugging
        console.log(`${isLiveMode ? LOG_PREFIX.LIVE : LOG_PREFIX.TEST} Checkout session completed:`, JSON.stringify(session, null, 2));
        
        // Get user ID and plan type from session metadata
        const userId = session.metadata?.userId || session.client_reference_id;
        const customerId = session.customer;
        const planType = session.metadata?.planType;
        
        if (!userId || !customerId || !planType) {
          console.error(`${LOG_PREFIX.ERROR} Missing required data in session:`, {
            userId,
            customerId,
            planType,
            sessionId: session.id
          });
          return new Response(
            JSON.stringify({ error: 'Missing required session data' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log(`${isLiveMode ? LOG_PREFIX.LIVE : LOG_PREFIX.TEST} Updating subscription for user ${userId} with plan ${planType} and customer ${customerId}`);
        
        // Update user profile with subscription info
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_plan: planType,
            subscription_status: 'active',
            subscription_id: session.subscription || session.id,
            payment_method: 'card',
            stripe_customer_id: customerId,
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
        console.log(`${isLiveMode ? LOG_PREFIX.LIVE : LOG_PREFIX.TEST} Subscription deleted:`, JSON.stringify(subscription, null, 2));
        
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
        console.log(`${isLiveMode ? LOG_PREFIX.LIVE : LOG_PREFIX.TEST} Subscription updated:`, JSON.stringify(subscription, null, 2));
        
        // Find user with this subscription ID
        const { data: profiles, error: lookupError } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .limit(1);
          
        if (lookupError) {
          console.error(`${LOG_PREFIX.ERROR} Error looking up user for subscription:`, lookupError);
          return new Response(
            JSON.stringify({ received: true, event: event.type, warning: "Database lookup error" }),
            { 
              status: 200, // Still return 200 to acknowledge receipt
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        if (!profiles || profiles.length === 0) {
          // Instead of throwing an error, log this condition and return a 200 response
          // This handles the case where this event arrives before checkout.session.completed
          console.log(`${LOG_PREFIX.INFO} No user found for subscription ${subscription.id}. This is normal if the checkout.session.completed event hasn't been processed yet.`);
          return new Response(
            JSON.stringify({ 
              received: true, 
              event: event.type, 
              message: "No user found for this subscription yet, but event acknowledged"
            }),
            { 
              status: 200, // Return 200 to acknowledge receipt
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
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
          return new Response(
            JSON.stringify({ received: true, event: event.type, warning: "Database update error" }),
            { 
              status: 200, // Still return 200 to acknowledge receipt
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log(`${LOG_PREFIX.SUCCESS} Successfully updated subscription status to ${status} for user ${userId}`);
      }
      else {
        console.log(`${LOG_PREFIX.INFO} Unhandled event type: ${event.type}`);
      }

      // Return a successful response
      return new Response(
        JSON.stringify({ received: true, event: event.type, mode: isLiveMode ? 'live' : 'test' }),
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
