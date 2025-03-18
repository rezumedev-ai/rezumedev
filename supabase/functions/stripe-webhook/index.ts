
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Initialize environment variables with explicit error handling
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Log initial environment check - this helps confirm if the function is invoked
console.log(`Stripe webhook function loaded. Environment check:
  - STRIPE_SECRET_KEY: ${stripeSecretKey ? 'Present' : 'MISSING'}
  - STRIPE_WEBHOOK_SECRET: ${webhookSecret ? 'Present' : 'MISSING'}
  - SUPABASE_URL: ${supabaseUrl ? 'Present' : 'MISSING'}
  - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Present' : 'MISSING'}`
);

// Initialize Stripe client
const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create consistent error responses
const errorResponse = (message, status = 400, details = null) => {
  console.error(`Error: ${message}`, details ? `Details: ${JSON.stringify(details)}` : '');
  return new Response(
    JSON.stringify({
      error: message,
      details: details
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Helper to create success responses
const successResponse = (data) => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Handle Stripe checkout.session.completed event
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const planType = session.metadata?.planType;
  
  console.log(`Processing checkout.session.completed:
    Session ID: ${session.id}
    User ID: ${userId || 'MISSING'}
    Plan Type: ${planType || 'MISSING'}
    Status: ${session.status}
    Subscription ID: ${session.subscription || 'MISSING'}`
  );
  
  if (!userId) {
    console.error('No user ID found in session metadata or client_reference_id');
    return false;
  }
  
  // Only update user profile if the session was successful
  if (session.status === 'expired') {
    console.log(`Checkout session ${session.id} has expired. No action taken.`);
    return true; // We successfully processed this event by taking no action
  }
  
  // If the session doesn't have a subscription ID but completed, check if it's a one-time payment
  if (!session.subscription && session.status === 'complete' && session.mode === 'payment') {
    // For one-time payments like lifetime subscriptions
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planType,
        subscription_status: 'active',
        subscription_id: session.id, // Use session ID as reference for one-time payments
        payment_method: 'card',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile after one-time payment:', error);
      return false;
    }
    
    console.log(`Successfully updated subscription for one-time payment, user ${userId}`);
    return true;
  }
  
  // Handle regular subscription checkout
  if (session.subscription) {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_plan: planType,
        subscription_status: 'active',
        subscription_id: session.subscription,
        payment_method: 'card',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating profile after checkout:', error);
      return false;
    } 
    
    console.log(`Successfully updated subscription for user ${userId}`);
    return true;
  }
  
  console.log(`No subscription found in session and not a one-time payment. Session status: ${session.status}`);
  return true; // We successfully processed this event by understanding it doesn't need action
}

// Handle Stripe subscription updated event
async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.userId;
  let profileId = userId;
  
  if (!profileId) {
    // Try to find user by subscription ID
    console.log(`No userId in metadata, looking up profile by subscription_id: ${subscription.id}`);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_id', subscription.id)
      .limit(1);
      
    if (error || !profiles || profiles.length === 0) {
      console.error('Could not find user for subscription:', subscription.id, error);
      return false;
    }
    
    profileId = profiles[0].id;
    console.log(`Found user ${profileId} for subscription ${subscription.id}`);
  }
  
  // Update subscription status
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileId);
    
  if (updateError) {
    console.error('Error updating subscription status:', updateError);
    return false;
  }
  
  console.log(`Updated subscription status to ${subscription.status} for user ${profileId}`);
  return true;
}

// Handle subscription canceled
async function handleSubscriptionCanceled(subscription) {
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscription.id)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscription.id, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Subscription canceled: ${subscription.id} for user: ${userId}`);
  
  // Mark as canceled but DO NOT remove the plan yet - they keep access until period ends
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
      // Note: NOT removing subscription_plan here to maintain access
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to canceled:', updateError);
    return false;
  }
  
  console.log(`Successfully marked subscription as canceled for user ${userId}`);
  return true;
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscription.id)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscription.id, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Subscription deleted/ended: ${subscription.id} for user: ${userId}`);
  
  // Update subscription status to canceled and remove plan access
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      subscription_plan: null,  // Remove plan when subscription is completely ended
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to inactive:', updateError);
    return false;
  }
  
  console.log(`Successfully removed subscription plan for user ${userId}`);
  return true;
}

// Handle payment failure
async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) {
    console.error('No subscription ID found in invoice');
    return false;
  }
  
  // Find the user with this subscription ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .limit(1);
    
  if (error || !profiles || profiles.length === 0) {
    console.error('Could not find user for subscription:', subscriptionId, error);
    return false;
  }
  
  const userId = profiles[0].id;
  console.log(`Payment failed for subscription: ${subscriptionId}, user: ${userId}`);
  
  // Update subscription status to past_due
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
      // Note: Keep subscription_plan to maintain access during grace period
    })
    .eq('id', userId);
    
  if (updateError) {
    console.error('Error updating subscription status to past_due:', updateError);
    return false;
  }
  
  console.log(`Successfully marked subscription as past_due for user ${userId}`);
  return true;
}

// Handle checkout.session.expired event
async function handleCheckoutSessionExpired(session) {
  const userId = session.metadata?.userId || session.client_reference_id;
  
  console.log(`Processing checkout.session.expired:
    Session ID: ${session.id}
    User ID: ${userId || 'MISSING'}
    Created: ${new Date(session.created * 1000).toISOString()}
    Expired: ${new Date(session.expires_at * 1000).toISOString()}`
  );
  
  if (!userId) {
    console.log('No user ID found in expired session metadata or client_reference_id');
    return true; // Not an error, just nothing to do
  }
  
  // No database updates needed for expired sessions - just log it
  console.log(`Checkout session ${session.id} expired for user ${userId}. No action required.`);
  return true;
}

// Main webhook handler
Deno.serve(async (req) => {
  // Log webhook execution start to help with debugging
  console.log(`Webhook request received: ${req.method} ${req.url.toString()}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Validate environment variables
  if (!stripeSecretKey) {
    return errorResponse('STRIPE_SECRET_KEY is not configured', 500);
  }
  
  if (!webhookSecret) {
    return errorResponse('STRIPE_WEBHOOK_SECRET is not configured', 500);
  }
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return errorResponse('Supabase connection configuration is missing', 500);
  }

  // Check for Stripe signature header
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return errorResponse('Missing Stripe signature header');
  }
  
  console.log(`Stripe signature received: ${signature.substring(0, 10)}...`);

  try {
    // Get the raw request body
    const rawBody = await req.text();
    console.log(`Request body received (${rawBody.length} bytes)`);
    
    // For debugging, log a small part of the payload without sensitive data
    try {
      const bodyObj = JSON.parse(rawBody);
      console.log(`Event type: ${bodyObj.type}, Event ID: ${bodyObj.id}`);
    } catch (e) {
      console.log('Could not parse body for logging');
    }
    
    // Construct and verify the Stripe event
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      console.log(`✅ Stripe signature verified for event: ${event.type}`);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      console.error(`Webhook secret length: ${webhookSecret.length} characters`);
      console.error(`First 50 chars of raw body: "${rawBody.substring(0, 50)}..."`);
      return errorResponse(`Webhook signature verification failed: ${err.message}`);
    }

    // Process the event
    console.log(`Processing Stripe event: ${event.type} (${event.id})`);
    let handlerResult = false;
    
    switch (event.type) {
      case 'checkout.session.completed':
        handlerResult = await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'checkout.session.expired':
        handlerResult = await handleCheckoutSessionExpired(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        handlerResult = await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        handlerResult = await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'customer.subscription.canceled':
        handlerResult = await handleSubscriptionCanceled(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        handlerResult = await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type} - acknowledging receipt`);
        handlerResult = true; // We're successfully ignoring this event type
    }

    // Return success or partial failure
    if (handlerResult === false) {
      return errorResponse(`Handler for ${event.type} failed to process the event correctly`, 422);
    }
    
    return successResponse({ received: true, event_type: event.type, processed: true });
    
  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    return errorResponse(
      'Unexpected error processing webhook', 
      500, 
      { message: error.message, stack: error.stack }
    );
  }
});
