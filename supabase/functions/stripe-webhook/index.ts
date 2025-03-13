
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

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('Missing Stripe signature header');
    return new Response(JSON.stringify({ error: 'Missing Stripe signature header' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // You would add your webhook signing secret from Stripe dashboard
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const body = await req.text();
    
    // Verify the event with Stripe
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process the event
    console.log(`Processing Stripe event: ${event.type}`);
    
    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get user ID from session metadata
        const userId = session.metadata?.userId || session.client_reference_id;
        const planType = session.metadata?.planType;
        
        if (!userId) {
          console.error('No user ID found in session metadata');
          break;
        }
        
        // In a real implementation, you'd create or update a subscription record
        // This is a simplified example
        console.log(`Payment successful for user ${userId} - Plan: ${planType}`);
        
        // Here you would typically:
        // 1. Check if a user profile exists
        // 2. Create or update subscription information
        // 3. Set user access rights
        
        // Example: Update user profile with subscription info
        // Create a subscriptions table for this later
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_plan: planType,
            subscription_status: 'active',
            subscription_id: session.subscription || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) {
          console.error('Error updating profile:', error);
        }
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        // Handle subscription updates
        console.log(`Subscription updated: ${subscription.id}`);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Handle subscription cancellations
        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }
      
      // Add more event types as needed
      
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: 'Error processing webhook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
