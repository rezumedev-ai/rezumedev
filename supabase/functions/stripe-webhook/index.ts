
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

// Main webhook handler for Stripe events
Deno.serve(async (req) => {
  // Log webhook execution start
  console.log(`Webhook request received: ${req.method} ${req.url.toString()}`);
  
  // Log relevant request headers for debugging
  const stripe_signature = req.headers.get('stripe-signature');
  console.log(`Stripe-Signature: ${stripe_signature ? 'Present' : 'MISSING'}`);
  console.log(`Content-Type: ${req.headers.get('content-type')}`);
  
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
    
    // Log the event type for debugging
    try {
      const bodyObj = JSON.parse(rawBody);
      console.log(`Event type: ${bodyObj.type || 'unknown'}, Event ID: ${bodyObj.id || 'unknown'}`);
    } catch (e) {
      console.log('Could not parse body for logging:', e);
    }
    
    // Process the webhook - with or without signature verification
    const signature = req.headers.get('stripe-signature');
    let event;
    
    try {
      if (signature && webhookSecret) {
        console.log(`Verifying Stripe signature: ${signature.substring(0, 15)}...`);
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        console.log(`✅ Stripe signature verified for event: ${event.type}`);
      } else {
        // If no signature or webhook secret, try to parse the event directly
        console.log(`⚠️ No signature verification - parsing event directly`);
        event = JSON.parse(rawBody);
        console.log(`Parsing unverified event: ${event.type || 'unknown type'}`);
      }
    } catch (err) {
      console.error(`⚠️ Event processing failed: ${err.message}`);
      
      // Try to parse the event anyway
      try {
        console.log(`Attempting to process without verification`);
        event = JSON.parse(rawBody);
      } catch (parseErr) {
        console.error(`Failed to parse event JSON: ${parseErr.message}`);
        return errorResponse(`Webhook error: ${parseErr.message}`, 400);
      }
    }

    // Process the event
    console.log(`Processing Stripe event: ${event.type} (${event.id})`);
    const handlerResult = await processEvent(event);
    
    if (handlerResult === false) {
      console.error(`Handler for ${event.type} failed to process the event correctly`);
      return errorResponse(`Handler for ${event.type} failed`, 422);
    }
    
    console.log(`Successfully processed event: ${event.type}`);
    return successResponse({ received: true, event_type: event.type, processed: true });
    
  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    return errorResponse(
      'Webhook processing error', 
      500, 
      { message: error.message, stack: error.stack }
    );
  }
});

// Process different types of Stripe events
async function processEvent(event: any): Promise<boolean> {
  console.log(`Processing Stripe event: ${event.type} (${event.id})`);
  
  // Handle different event types
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
      return true; // Just acknowledge these events for now
      
    case 'charge.succeeded':
      console.log('Handling charge.succeeded event');
      return true; // Just acknowledge these events for now
      
    case 'customer.created':
      console.log('Handling customer.created event');
      return true; // Just acknowledge these events for now
      
    case 'customer.updated':
      console.log('Handling customer.updated event');
      return true; // Just acknowledge these events for now
      
    // Handle other common events
    case 'invoice.created':
    case 'invoice.updated':
    case 'invoice.finalized':
    case 'invoice.paid':
    case 'setup_intent.created':
    case 'setup_intent.succeeded':
      console.log(`Handling ${event.type} event`);
      return true; // Just acknowledge these events for now
      
    default:
      console.log(`Unhandled event type: ${event.type} - acknowledging receipt`);
      return true; // We're successfully ignoring this event type
  }
}
