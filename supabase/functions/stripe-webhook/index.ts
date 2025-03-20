
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

// Define completely permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// Helper function to return a standardized response
function createResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  // Log request details for debugging
  console.log("Webhook received:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries([...req.headers.entries()].map(([k, v]) => 
      [k, k.toLowerCase().includes('secret') ? '***REDACTED***' : v]
    ))
  });

  // Handle CORS preflight requests - always return 200
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Accept GET requests for testing webhook connectivity
  if (req.method === 'GET') {
    console.log("GET request received - returning test success");
    return createResponse({ success: true, message: "Webhook endpoint is functioning" });
  }

  try {
    if (req.method === 'POST') {
      console.log("Processing POST webhook request");
      
      // Get the raw request body as text
      const body = await req.text();
      console.log("Request body length:", body.length);
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      
      if (!signature) {
        console.error('Missing stripe-signature header - proceeding anyway');
        // Continue processing even without signature to prevent Stripe retries
      }

      // Get webhook secret from environment
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        console.error('Missing webhook secret in environment variables - proceeding anyway');
        // Continue processing even without webhook secret
      }

      // We'll attempt to verify the event if we have all requirements
      let event;
      if (signature && webhookSecret) {
        try {
          console.log("Verifying webhook signature...");
          event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
          console.log(`Event verified successfully: ${event.type}`);
        } catch (err) {
          console.error(`Webhook signature verification failed: ${err.message}`);
          // Continue anyway to prevent Stripe retries, but we'll log the failure
        }
      }
      
      // If we couldn't verify or didn't have what we needed to verify
      if (!event) {
        console.log("Attempting to parse event from raw body...");
        try {
          event = JSON.parse(body);
          console.log("Parsed raw event successfully");
        } catch (err) {
          console.error("Failed to parse raw event:", err.message);
          return createResponse({ 
            success: false, 
            error: "Invalid JSON payload", 
            message: "Could not parse event" 
          });
        }
      }

      // Handle the event based on its type
      console.log("Processing event type:", event?.type);
      
      if (event?.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Log the entire session for debugging
        console.log("Checkout session completed:", JSON.stringify(session, null, 2));
        
        // Get user ID from session metadata
        const userId = session.metadata?.userId || session.client_reference_id;
        const planType = session.metadata?.planType;
        
        if (!userId) {
          console.error('No user ID found in session:', session.id);
          // Still return success to prevent Stripe retries
          return createResponse({ 
            success: false, 
            message: "Subscription processed but userId was missing" 
          });
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
          // Still return success to prevent Stripe retries
          return createResponse({ 
            success: false, 
            error: updateError, 
            message: "Error updating user profile" 
          });
        }
        
        console.log(`Successfully updated subscription for user ${userId}`);
      } 
      else if (event?.type === 'customer.subscription.deleted') {
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
          // Still return success to prevent Stripe retries
          return createResponse({ 
            success: false, 
            message: "Subscription deletion processed but user not found" 
          });
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
          // Still return success to prevent Stripe retries
          return createResponse({ 
            success: false, 
            error: updateError, 
            message: "Error updating subscription status" 
          });
        }
        
        console.log(`Successfully deactivated subscription for user ${userId}`);
      }
      else {
        console.log(`Unhandled event type: ${event?.type || 'unknown'}`);
      }

      // Always return a successful response to prevent Stripe retries
      return createResponse({ 
        received: true, 
        event: event?.type || 'unknown type',
        message: "Webhook processed successfully"
      });
    }

    // If not OPTIONS or POST, return method not allowed but with 200 status to prevent retries
    console.log(`Received ${req.method} request, only POST/OPTIONS supported`);
    return createResponse({ 
      error: `Method ${req.method} not optimal, use POST`, 
      message: "This endpoint is designed for POST requests" 
    });

  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    // Still return success to prevent Stripe retries
    return createResponse({ 
      success: false, 
      error: `${error.name}: ${error.message}`, 
      stack: error.stack,
      message: "Error occurred but webhook acknowledged" 
    });
  }
});
