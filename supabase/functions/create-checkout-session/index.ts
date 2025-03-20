
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
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract parameters from request body
    const { planType, userId, successUrl, cancelUrl } = requestBody;
    
    // Log the received request for debugging
    console.log('Request received:', { planType, userId, successUrl, cancelUrl });
    
    // Validate request data
    if (!planType || !userId) {
      console.error('Missing required fields:', { planType, userId });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate plan type
    if (!['monthly', 'yearly', 'lifetime'].includes(planType)) {
      console.error('Invalid plan type:', planType);
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('User not found:', userError || userId);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set up product and pricing based on plan type
    let productName;
    let unitAmount;
    
    switch (planType) {
      case 'monthly':
        productName = 'Monthly Subscription';
        unitAmount = 999; // $9.99 in cents
        break;
      case 'yearly': 
        productName = 'Yearly Subscription';
        unitAmount = 8988; // $89.88 in cents
        break;
      case 'lifetime':
        productName = 'Lifetime Access';
        unitAmount = 19900; // $199 in cents
        break;
    }
    
    // Determine checkout mode based on plan type
    const mode = planType === 'lifetime' ? 'payment' : 'subscription';
    console.log('Checkout mode:', mode);
    
    try {
      // Create a checkout session with dynamic product data
      const sessionData = {
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: unitAmount,
            recurring: mode === 'subscription' ? {
              interval: planType === 'monthly' ? 'month' : 'year',
            } : undefined,
          },
          quantity: 1,
        }],
        mode: mode,
        success_url: successUrl || `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rezume.dev'}/payment-success`,
        cancel_url: cancelUrl || `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rezume.dev'}/pricing`,
        client_reference_id: userId,
        customer_email: userData.email,
        metadata: {
          userId: userId,
          planType: planType,
        },
      };
      
      console.log('Creating checkout session with data:', JSON.stringify(sessionData, null, 2));
      const session = await stripe.checkout.sessions.create(sessionData);

      // Log the session creation
      console.log(`Checkout session created: ${session.id} for user: ${userId}, plan: ${planType}`);

      // Return the session ID and URL to the client
      return new Response(
        JSON.stringify({ sessionId: session.id, url: session.url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      // Handle Stripe-specific errors
      console.error('Stripe error:', stripeError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Stripe checkout error', 
          message: stripeError.message,
          code: stripeError.statusCode || 500,
          type: stripeError.type || 'unknown'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    // Log the general error
    console.error('General error in function:', error);
    
    // Return error response with additional details
    return new Response(
      JSON.stringify({ 
        error: 'Checkout process failed',
        message: error.message || 'Unknown error',
        details: error.stack || 'No stack trace available'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
