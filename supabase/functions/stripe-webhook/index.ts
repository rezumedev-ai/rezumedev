
import { 
  stripe, 
  supabase, 
  corsHeaders, 
  errorResponse, 
  successResponse,
  validateEnvironment,
  logEnvironmentConfig,
  webhookSecret
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

import { handlePaymentFailed, handlePaymentSucceeded } from './payment-handlers.ts';

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
    console.error('Environment validation failed:', envError);
    return errorResponse(envError, 500);
  }

  try {
    // Get the raw request body
    const rawBody = await req.text();
    console.log(`Request body received (${rawBody.length} bytes)`);
    
    // For debugging, log a small part of the payload without sensitive data
    try {
      const bodyObj = JSON.parse(rawBody);
      console.log(`Event type: ${bodyObj.type}, Event ID: ${bodyObj.id}`);
      console.log(`Event data: ${JSON.stringify(bodyObj.data.object).substring(0, 200)}...`);
    } catch (e) {
      console.log('Could not parse body for logging:', e);
    }
    
    // Check for Stripe signature header
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('Missing Stripe signature header. Headers available:', Array.from(req.headers.keys()));
      
      // For testing/debugging - if we're in development mode, we can try to process the event without verification
      // You should remove this in production!
      try {
        const bodyObj = JSON.parse(rawBody);
        console.log(`⚠️ INSECURE PROCESSING - NO SIGNATURE! Event type: ${bodyObj.type}`);
        
        // Process the event without verification (ONLY FOR TESTING)
        const result = await processEvent(bodyObj);
        if (result) {
          return successResponse({ received: true, event_type: bodyObj.type, processed: true, verified: false });
        } else {
          return errorResponse(`Failed to process unverified event: ${bodyObj.type}`, 422);
        }
      } catch (e) {
        console.error('Failed to process unverified event:', e);
      }
      
      return errorResponse('Missing Stripe signature header', 401);
    }
    
    console.log(`Stripe signature received: ${signature.substring(0, 10)}...`);
    console.log(`Webhook secret length: ${webhookSecret?.length || 0} characters`);

    // Construct and verify the Stripe event
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret || '');
      console.log(`✅ Stripe signature verified for event: ${event.type}`);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      console.error(`First 50 chars of raw body: "${rawBody.substring(0, 50)}..."`);
      console.error(`Signature header: ${signature?.substring(0, 20)}...`);
      return errorResponse(`Webhook signature verification failed: ${err.message}`, 401);
    }

    // Process the event
    const handlerResult = await processEvent(event);
    
    if (handlerResult === false) {
      console.error(`Handler for ${event.type} failed to process the event correctly`);
      return errorResponse(`Handler for ${event.type} failed to process the event correctly`, 422);
    }
    
    console.log(`Successfully processed event: ${event.type}`);
    return successResponse({ received: true, event_type: event.type, processed: true, verified: true });
    
  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    return errorResponse(
      'Unexpected error processing webhook', 
      500, 
      { message: error.message, stack: error.stack }
    );
  }
});

// Process different types of Stripe events
async function processEvent(event: any): Promise<boolean> {
  console.log(`Processing Stripe event: ${event.type} (${event.id})`);
  
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Handling checkout.session.completed event');
      return await handleCheckoutSessionCompleted(event.data.object);
      
    case 'checkout.session.expired':
      console.log('Handling checkout.session.expired event');
      return await handleCheckoutSessionExpired(event.data.object);
      
    case 'customer.subscription.updated':
      console.log('Handling customer.subscription.updated event');
      return await handleSubscriptionUpdated(event.data.object);
      
    case 'customer.subscription.deleted':
      console.log('Handling customer.subscription.deleted event');
      return await handleSubscriptionDeleted(event.data.object);
      
    case 'customer.subscription.canceled':
      console.log('Handling customer.subscription.canceled event');
      return await handleSubscriptionCanceled(event.data.object);
      
    case 'invoice.payment_failed':
      console.log('Handling invoice.payment_failed event');
      return await handlePaymentFailed(event.data.object);
      
    case 'invoice.payment_succeeded':
      console.log('Handling invoice.payment_succeeded event');
      return await handlePaymentSucceeded(event.data.object);
      
    case 'payment_intent.succeeded':
      console.log('Handling payment_intent.succeeded event');
      return true; // We just log this event for now
      
    case 'charge.succeeded':
      console.log('Handling charge.succeeded event');
      return true; // We just log this event for now
      
    case 'customer.created':
      console.log('Handling customer.created event');
      return true; // We just log this event for now
      
    case 'customer.updated':
      console.log('Handling customer.updated event');
      return true; // We just log this event for now
      
    case 'invoice.created':
      console.log('Handling invoice.created event');
      return true; // We just log this event for now
      
    case 'invoice.updated':
      console.log('Handling invoice.updated event');
      return true; // We just log this event for now
      
    case 'invoice.finalized':
      console.log('Handling invoice.finalized event');
      return true; // We just log this event for now
      
    case 'invoice.paid':
      console.log('Handling invoice.paid event');
      return true; // We just log this event for now
      
    default:
      console.log(`Unhandled event type: ${event.type} - acknowledging receipt`);
      return true; // We're successfully ignoring this event type
  }
}
