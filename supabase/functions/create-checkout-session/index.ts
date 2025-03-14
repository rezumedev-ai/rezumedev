
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Stripe with the secret key from environment variable
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define price IDs for each plan
const PRICE_IDS = {
  monthly: 'price_1OweEfJEGqPHzSqoLjK9LIYu', // Monthly plan
  yearly: 'price_1OweF9JEGqPHzSqoT0WDJv5C',  // Yearly plan
  lifetime: 'price_1OweFaJEGqPHzSqokvGFpQwv', // Lifetime plan
};

// Log environment for debugging
console.log('Function environment:', {
  hasStripeKey: !!Deno.env.get('STRIPE_SECRET_KEY'),
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseAnonKey: !!supabaseAnonKey,
  priceIds: PRICE_IDS
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body first to avoid parsing errors
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
    const { planType, successUrl, cancelUrl } = requestBody;
    
    // Log the received request for debugging
    console.log('Request received:', { planType, successUrl, cancelUrl });
    
    // Get the JWT token from authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token and get the user
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const user = userData?.user;
    
    if (!user) {
      console.error('No user found after authentication');
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Authenticated user:', { id: user.id, email: user.email });
    
    // Validate plan type
    if (!planType || !Object.keys(PRICE_IDS).includes(planType)) {
      console.error('Invalid plan type:', planType);
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Choose price ID based on selected plan
    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS];
    console.log('Selected price ID:', priceId);
    
    // Determine checkout mode based on plan type
    const mode = planType === 'lifetime' ? 'payment' : 'subscription';
    console.log('Checkout mode:', mode);
    
    try {
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: successUrl || 'https://rezume.dev/payment-success',
        cancel_url: cancelUrl || 'https://rezume.dev/pricing',
        client_reference_id: user.id,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          planType: planType,
        },
      });

      // Log the session creation
      console.log(`Checkout session created: ${session.id} for user: ${user.id}, plan: ${planType}`);

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
