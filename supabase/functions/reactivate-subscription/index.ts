
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Stripe with the secret key from environment variable
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client with service role for admin access
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Log prefixes for better visibility
const LOG_PREFIX = {
  INFO: "🔵 INFO:",
  ERROR: "🔴 ERROR:",
  SUCCESS: "✅ SUCCESS:",
  LIVE: "🔴 LIVE:",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (e) {
      console.error(`${LOG_PREFIX.ERROR} Error parsing request body:`, e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract parameters from request body
    const { userId, mode = 'test' } = requestBody;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`${LOG_PREFIX.INFO} Reactivating subscription for user: ${userId} in ${mode.toUpperCase()} mode`);
    
    // Get the user's subscription information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_id, subscription_plan')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error(`${LOG_PREFIX.ERROR} Error fetching profile:`, profileError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile', details: profileError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const subscriptionId = profile?.subscription_id;
    
    if (!subscriptionId) {
      console.error(`${LOG_PREFIX.ERROR} No subscription ID found for user:`, userId);
      return new Response(
        JSON.stringify({ error: 'No subscription found for this user' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`${LOG_PREFIX.INFO} Found subscription ID: ${subscriptionId}`);
    
    // Check if we're in live mode
    if (mode === 'live') {
      console.log(`${LOG_PREFIX.LIVE} Operating in LIVE mode for subscription: ${subscriptionId}`);
    }
    
    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription) {
      console.error(`${LOG_PREFIX.ERROR} Subscription not found in Stripe:`, subscriptionId);
      return new Response(
        JSON.stringify({ error: 'Subscription not found in payment provider' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the subscription is canceled
    if (subscription.status !== 'canceled' && subscription.cancel_at_period_end !== true) {
      console.warn(`${LOG_PREFIX.INFO} Subscription is not canceled:`, subscriptionId);
      return new Response(
        JSON.stringify({ message: 'Subscription is already active' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Reactivate the subscription
    let reactivatedSubscription;
    
    if (subscription.cancel_at_period_end) {
      // If set to cancel at period end, just remove the cancellation
      console.log(`${LOG_PREFIX.INFO} Removing cancellation at period end for subscription: ${subscriptionId}`);
      reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
    } else {
      // If already canceled, create a new subscription with the same plan
      console.log(`${LOG_PREFIX.INFO} Creating new subscription for user: ${userId}`);
      
      // Get the customer ID from the canceled subscription
      const customerId = subscription.customer as string;
      
      // Find the price ID that was being used
      const priceId = subscription.items.data[0]?.price.id;
      
      if (!priceId) {
        console.error(`${LOG_PREFIX.ERROR} Could not determine price ID from canceled subscription`);
        return new Response(
          JSON.stringify({ error: 'Could not determine subscription price' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Create a new subscription with the same price
      reactivatedSubscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: { userId, environment: mode },
      });
    }
    
    if (!reactivatedSubscription) {
      throw new Error('Failed to reactivate subscription');
    }
    
    console.log(`${LOG_PREFIX.SUCCESS} Successfully reactivated subscription: ${reactivatedSubscription.id}`);
    
    // Update the profile in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_id: reactivatedSubscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error(`${LOG_PREFIX.ERROR} Error updating profile:`, updateError);
      return new Response(
        JSON.stringify({ error: 'Error updating user profile', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription reactivated successfully',
        subscription: { 
          id: reactivatedSubscription.id,
          status: reactivatedSubscription.status,
          liveMode: mode === 'live'
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`${LOG_PREFIX.ERROR} Error reactivating subscription:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error reactivating subscription', 
        message: error.message || 'Unknown error',
        details: error.stack || 'No stack trace available'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
