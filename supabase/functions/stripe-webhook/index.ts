
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

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    console.error('Missing Stripe signature header');
    return new Response(JSON.stringify({ error: 'Missing Stripe signature header' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Use your webhook signing secret from Stripe dashboard
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
    const body = await req.text();
    
    let event;
    
    // Skip verification during development if no webhook secret is set
    if (webhookSecret) {
      try {
        // Verify the event with Stripe
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      // For development - parse without verification (not recommended for production)
      event = JSON.parse(body);
      console.warn('⚠️ Webhook secret not configured. Skipping signature verification.');
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
        
        console.log(`Payment successful for user ${userId} - Plan: ${planType}`);
        
        // Update user profile with subscription info
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_plan: planType,
            subscription_status: 'active',
            subscription_id: session.subscription || session.id,
            payment_method: 'card',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) {
          console.error('Error updating profile:', error);
        } else {
          console.log(`Successfully updated subscription for user ${userId}`);
        }
        
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (!userId) {
          // Try to find the user by subscription ID
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('subscription_id', subscription.id)
            .limit(1);
            
          if (error || !profiles || profiles.length === 0) {
            console.error('Could not find user for subscription:', subscription.id);
            break;
          }
          
          const userId = profiles[0].id;
          console.log(`Subscription updated: ${subscription.id} for user: ${userId}`);
          
          // Update subscription status
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: subscription.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating subscription status:', updateError);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Find the user with this subscription ID
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription.id)
          .limit(1);
          
        if (error || !profiles || profiles.length === 0) {
          console.error('Could not find user for subscription:', subscription.id);
          break;
        }
        
        const userId = profiles[0].id;
        console.log(`Subscription canceled: ${subscription.id} for user: ${userId}`);
        
        // Update subscription status to canceled
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating subscription status to canceled:', updateError);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        
        if (subscriptionId) {
          // Find the user with this subscription ID
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('subscription_id', subscriptionId)
            .limit(1);
            
          if (error || !profiles || profiles.length === 0) {
            console.error('Could not find user for subscription:', subscriptionId);
            break;
          }
          
          const userId = profiles[0].id;
          console.log(`Payment failed for subscription: ${subscriptionId}, user: ${userId}`);
          
          // Update subscription status to past_due
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Error updating subscription status to past_due:', updateError);
          }
        }
        break;
      }
      
      default:
        // Unexpected event type
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: 'Error processing webhook' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
