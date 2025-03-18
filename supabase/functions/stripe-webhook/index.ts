
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
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req) => {
  // Log all request details
  console.log('======== WEBHOOK REQUEST RECEIVED ========');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method === 'POST') {
      // Get the raw request body as text
      const body = await req.text();
      console.log('Raw body (truncated):', body.substring(0, 100) + '...');
      
      // Get and log stripe signature and webhook secret
      const signature = req.headers.get('stripe-signature');
      console.log('Stripe signature present:', !!signature);
      
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      console.log('Webhook secret configured:', !!webhookSecret);

      if (!signature || !webhookSecret) {
        console.error('Missing signature or webhook secret');
        return new Response(
          JSON.stringify({ error: 'Missing signature or webhook secret' }),
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
        console.log('Event constructed successfully:', event.type);
      } catch (err) {
        console.error('Error verifying webhook signature:', err.message);
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
        console.log('Processing checkout.session.completed:', session.id);
        
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
          return new Response(
            JSON.stringify({ error: 'Failed to update user profile' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log(`Successfully updated subscription for user ${userId}`);
      } 
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object;
        console.log('Processing subscription deletion:', subscription.id);
        
        // Find user with this subscription ID
        const { data: profiles, error: lookupError } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .limit(1);
          
        if (lookupError || !profiles || profiles.length === 0) {
          console.error('Could not find user for subscription:', subscription.id);
          return new Response(
            JSON.stringify({ error: 'User not found for subscription' }),
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
            JSON.stringify({ error: 'Failed to update subscription status' }),
            { 
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
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

    // If not OPTIONS or POST, return method not allowed
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
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
