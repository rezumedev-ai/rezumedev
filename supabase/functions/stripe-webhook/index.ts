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

// Define CORS headers - must be extremely permissive for Stripe webhooks
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Log detailed request information
  console.log('Webhook request received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  // Handle CORS preflight requests with more permissive response
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // For POST requests, proceed with webhook handling
    if (req.method === 'POST') {
      const body = await req.text();
      console.log('Request body received:', body.substring(0, 500) + '...'); // Log first 500 chars for safety

      // Get the stripe signature from headers
      const signature = req.headers.get('stripe-signature');
      console.log('Stripe signature present:', !!signature);

      // Get the webhook secret
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      console.log('Webhook secret configured:', !!webhookSecret);

      if (!signature || !webhookSecret) {
        const errorResponse = {
          error: 'Missing required headers or configuration',
          details: {
            hasSignature: !!signature,
            hasSecret: !!webhookSecret,
            headers: Object.fromEntries(req.headers.entries())
          }
        };
        console.error('Validation failed:', errorResponse);
        
        return new Response(
          JSON.stringify(errorResponse),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Verify the event
      let event;
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        console.log('Event successfully constructed:', event.type);
      } catch (err) {
        console.error('Webhook signature verification failed:', {
          error: err,
          signature: signature ? 'present' : 'missing',
          body: body ? 'present' : 'missing'
        });
        
        return new Response(
          JSON.stringify({
            error: `Webhook Error: ${err.message}`,
            details: {
              hasSignature: !!signature,
              hasBody: !!body,
              errorType: err.type
            }
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Handle supported events
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Processing checkout.session.completed', session);
          
          // Get user ID from session metadata
          const userId = session.metadata?.userId || session.client_reference_id;
          const planType = session.metadata?.planType;
          
          if (!userId) {
            console.error('No user ID found in session metadata', session);
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
            return new Response(
              JSON.stringify({ error: 'Failed to update user profile', details: updateError }),
              { 
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          console.log(`Successfully updated subscription for user ${userId}`);
          break;
        
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          console.log('Processing customer.subscription.deleted', subscription);
          
          // Find the user with this subscription ID
          const { data: profiles, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('subscription_id', subscription.id)
            .limit(1);
            
          if (lookupError || !profiles || profiles.length === 0) {
            console.error('Could not find user for subscription:', subscription.id);
            return new Response(
              JSON.stringify({ error: 'User not found for subscription', subscriptionId: subscription.id }),
              { 
                status: 404,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          const userId = profiles[0].id;
          console.log(`Updating subscription status to inactive for user ${userId}`);
          
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
            return new Response(
              JSON.stringify({ error: 'Failed to update subscription status', details: updateError }),
              { 
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          }
          
          console.log(`Successfully deactivated subscription for user ${userId}`);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Return success
      return new Response(
        JSON.stringify({ received: true, event: event.type }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // If not OPTIONS or POST, return method not allowed
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', {
      error: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
