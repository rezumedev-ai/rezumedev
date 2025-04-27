import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { planType, userId, successUrl, cancelUrl, mode = 'test' } = requestBody;
    
    // Determine which Stripe key to use based on mode
    const isLiveMode = mode === 'live';
    const stripeSecretKey = isLiveMode 
      ? Deno.env.get('STRIPE_LIVE_SECRET_KEY') || ''
      : Deno.env.get('STRIPE_SECRET_KEY') || '';
    
    if (!stripeSecretKey) {
      console.error(`Missing Stripe ${isLiveMode ? 'live' : 'test'} secret key`);
      return new Response(
        JSON.stringify({ error: `Stripe ${isLiveMode ? 'live' : 'test'} secret key not configured` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Stripe with the appropriate secret key
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Log the received request for debugging
    console.log(`[${isLiveMode ? 'LIVE' : 'TEST'}] Request received:`, { planType, userId, successUrl, cancelUrl });
    
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

    // Look up existing customer
    const customers = await stripe.customers.list({ email: userData.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing Stripe customer: ${customerId}`);
    } else {
      // Create a new customer if none exists
      const newCustomer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          userId: userId
        }
      });
      customerId = newCustomer.id;
      console.log(`Created new Stripe customer: ${customerId}`);
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
    const checkoutMode = planType === 'lifetime' ? 'payment' : 'subscription';
    console.log(`[${isLiveMode ? 'LIVE' : 'TEST'}] Checkout mode:`, checkoutMode);
    
    try {
      // Create a checkout session with dynamic product data and customer ID
      const sessionData = {
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: unitAmount,
            recurring: checkoutMode === 'subscription' ? {
              interval: planType === 'monthly' ? 'month' : 'year',
            } : undefined,
          },
          quantity: 1,
        }],
        mode: checkoutMode,
        success_url: successUrl || `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rezume.dev'}/payment-success`,
        cancel_url: cancelUrl || `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rezume.dev'}/pricing`,
        client_reference_id: userId,
        metadata: {
          userId: userId,
          planType: planType,
          mode: isLiveMode ? 'live' : 'test',
        },
      };
      
      console.log(`[${isLiveMode ? 'LIVE' : 'TEST'}] Creating checkout session with data:`, JSON.stringify(sessionData, null, 2));
      const session = await stripe.checkout.sessions.create(sessionData);

      // Log the session creation
      console.log(`[${isLiveMode ? 'LIVE' : 'TEST'}] Checkout session created: ${session.id} for user: ${userId}, plan: ${planType}`);

      // Return the session ID and URL to the client
      return new Response(
        JSON.stringify({ sessionId: session.id, url: session.url }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (stripeError) {
      // Handle Stripe-specific errors
      console.error(`[${isLiveMode ? 'LIVE' : 'TEST'}] Stripe error:`, stripeError);
      
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
