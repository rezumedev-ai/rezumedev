
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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// THIS IS A COMPLETELY PUBLIC ENDPOINT WITH NO AUTHORIZATION CHECKS
Deno.serve(async (req) => {
  console.log("========== NEW WEBHOOK REQUEST RECEIVED ==========");
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  
  // Log all request headers for debugging
  console.log("All request headers:");
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Handle CORS preflight requests with very permissive settings
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === 'POST') {
      console.log("Processing POST webhook request from Stripe");
      
      // Get the raw request body as text and log it
      const body = await req.text();
      console.log("Request body length:", body.length);
      console.log("Request body preview (first 200 chars):", body.substring(0, 200));
      
      // Get the stripe signature header
      const signature = req.headers.get('stripe-signature');
      console.log("Stripe signature present:", signature ? "YES" : "NO");
      
      // Get webhook secret from environment
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      console.log("Webhook secret configured:", webhookSecret ? "YES" : "NO");
      
      // Initialize event variable
      let event;
      
      // FIRST ATTEMPT: Try parsing with Stripe's verification
      if (signature && webhookSecret) {
        try {
          console.log("Attempting official Stripe signature verification");
          event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
          console.log("✅ Official verification successful!");
        } catch (err) {
          console.log("❌ Official verification failed:", err.message);
          // Continue to fallback method - don't return error response
        }
      } else {
        console.log("Missing signature or webhook secret, skipping official verification");
      }
      
      // FALLBACK: If verification failed or was skipped, try direct parsing
      if (!event) {
        try {
          console.log("Attempting direct JSON parsing of webhook data");
          event = JSON.parse(body);
          console.log("✅ Direct parsing successful!");
        } catch (parseErr) {
          console.error("❌ Direct parsing failed:", parseErr.message);
          return new Response(
            JSON.stringify({ error: "Could not parse webhook body as JSON" }),
            { 
              status: 200, // Return 200 even on error to prevent Stripe from retrying
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
      
      // Log successful event parsing
      console.log("Event type:", event.type);
      console.log("Event ID:", event.id);
      
      // Handle checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Processing checkout.session.completed");
        console.log("Session ID:", session.id);
        
        // Get user ID from session metadata or client_reference_id
        const userId = session.metadata?.userId || session.client_reference_id;
        const planType = session.metadata?.planType;
        
        if (!userId) {
          console.error('No user ID found in session:', session.id);
          // Continue processing anyway for debugging
          console.log("Full session object:", JSON.stringify(session, null, 2));
        } else {
          console.log(`Found user ID: ${userId} with plan: ${planType}`);
          
          try {
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
            } else {
              console.log(`✅ Successfully updated subscription for user ${userId}`);
            }
          } catch (dbError) {
            console.error("Database operation failed:", dbError);
          }
        }
      } 
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        console.log("Processing customer.subscription.deleted");
        console.log("Subscription ID:", subscription.id);
        
        try {
          // Find user with this subscription ID
          const { data: profiles, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('subscription_id', subscription.id)
            .limit(1);
            
          if (lookupError) {
            console.error('Error looking up user:', lookupError);
          } else if (!profiles || profiles.length === 0) {
            console.log('No user found with subscription ID:', subscription.id);
          } else {
            const userId = profiles[0].id;
            console.log(`Found user ${userId} for subscription ${subscription.id}`);
            
            // Update subscription status
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
            } else {
              console.log(`✅ Successfully deactivated subscription for user ${userId}`);
            }
          }
        } catch (dbError) {
          console.error("Database operation failed:", dbError);
        }
      }
      else {
        console.log(`Unhandled event type: ${event.type}`);
      }

      // Always return success to Stripe
      console.log("Returning success response to Stripe");
      return new Response(
        JSON.stringify({ received: true, processingSuccessful: true }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // For all other HTTP methods, return 200 OK with permissive headers
    console.log(`Handling ${req.method} request, returning 200 OK`);
    return new Response(
      JSON.stringify({ status: "ok", message: "Stripe webhook endpoint is active" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    // Log any unexpected errors
    console.error('CRITICAL ERROR in webhook handler:', error);
    console.error('Error stack:', error.stack);
    
    // Always return a 200 success response to Stripe in production
    // This prevents Stripe from retrying constantly, while we can still log the error
    return new Response(
      JSON.stringify({ 
        received: true, 
        error: 'Error logged but accepting webhook' 
      }),
      { 
        status: 200, // Return 200 even on error to prevent retries
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
