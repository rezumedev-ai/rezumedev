
import { 
  stripe, 
  supabase, 
  corsHeaders, 
  errorResponse, 
  successResponse,
  validateEnvironment,
  logEnvironmentConfig
} from './utils.ts';

import { 
  handleCheckoutSessionCompleted, 
  handleCheckoutSessionExpired 
} from './checkout-handlers.ts';

import { 
  handleSubscriptionUpdated, 
  handleSubscriptionCanceled, 
  handleSubscriptionDeleted 
} from './subscription-handlers.ts';

import { handlePaymentFailed } from './payment-handlers.ts';

// Log environment configuration at initialization
logEnvironmentConfig();

// Main webhook handler
Deno.serve(async (req) => {
  // Log webhook execution start to help with debugging
  console.log(`Webhook request received: ${req.method} ${req.url.toString()}`);
  
  // Log all request headers for debugging
  console.log('Request headers:');
  req.headers.forEach((value, key) => {
    console.log(`${key}: ${key === 'stripe-signature' ? value.substring(0, 15) + '...' : value}`);
  });
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Validate environment variables
  const envError = validateEnvironment();
  if (envError) {
    return errorResponse(envError, 500);
  }

  // Check for Stripe signature header
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.error('Missing Stripe signature header. Headers available:', Array.from(req.headers.keys()));
    return errorResponse('Missing Stripe signature header', 401);
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
      event = stripe.webhooks.constructEvent(rawBody, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET') || '');
      console.log(`✅ Stripe signature verified for event: ${event.type}`);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      console.error(`Webhook secret length: ${Deno.env.get('STRIPE_WEBHOOK_SECRET')?.length} characters`);
      console.error(`First 50 chars of raw body: "${rawBody.substring(0, 50)}..."`);
      console.error(`Signature header: ${signature?.substring(0, 20)}...`);
      return errorResponse(`Webhook signature verification failed: ${err.message}`, 401);
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
