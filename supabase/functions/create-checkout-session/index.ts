
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

// Define price IDs for each plan - using actual Stripe price IDs
const PRICE_IDS = {
  monthly: 'price_1OvDSiJEGqPHzSqoxX59tJv0', // $9.99/month plan
  yearly: 'price_1OvDT8JEGqPHzSqohDnJc73N',  // $89.88/year plan ($7.49/month)
  lifetime: 'price_1OvDTXJEGqPHzSqoe2hZDrKI', // $199 one-time payment
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the JWT token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the JWT token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { planType, successUrl, cancelUrl } = await req.json();
    
    // Validate plan type
    if (!planType || !Object.keys(PRICE_IDS).includes(planType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Choose price ID based on selected plan
    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS];
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: planType === 'lifetime' ? 'payment' : 'subscription',
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

    // Return the session ID to the client
    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Log the error
    console.error('Error creating checkout session:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
