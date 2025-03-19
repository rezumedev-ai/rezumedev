
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

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validate environment setup
function validateEnvironment() {
  const issues = [];
  
  if (!stripeSecretKey) {
    issues.push("STRIPE_SECRET_KEY is not set");
  }
  
  if (!supabaseUrl) {
    issues.push("SUPABASE_URL is not set");
  }
  
  if (!supabaseAnonKey) {
    issues.push("SUPABASE_ANON_KEY is not set");
  }
  
  return issues;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const envIssues = validateEnvironment();
    if (envIssues.length > 0) {
      console.error("Environment validation failed:", envIssues);
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          details: envIssues.join(', ')
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    const { planType, successUrl, cancelUrl, userId } = requestBody;
    
    // Log the received request for debugging
    console.log('Request received:', { planType, successUrl, cancelUrl, userId });

    // Check if we have a valid userId either from the request body directly or from auth
    let authenticatedUserId = userId;
    
    // If userId wasn't provided directly, get it from authorization
    if (!authenticatedUserId) {
      // Get the JWT token from authorization header
      const authHeader = req.headers.get('Authorization');
      
      if (!authHeader) {
        console.error('No authorization header provided and no userId in request body');
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
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
      
      authenticatedUserId = user.id;
      console.log('User authenticated via token:', { id: user.id, email: user.email });
    } else {
      console.log('Using provided userId from request body:', authenticatedUserId);
    }
    
    // Fetch user email from database since we need it for Stripe
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', authenticatedUserId)
      .single();
      
    if (profileError || !profileData) {
      console.error('Error fetching user profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const userEmail = profileData.email;
    
    // Validate plan type
    if (!planType || !['monthly', 'yearly', 'lifetime'].includes(planType)) {
      console.error('Invalid plan type:', planType);
      return new Response(
        JSON.stringify({ error: 'Invalid plan type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, try to find an existing product for this plan type
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
    
    const mode = planType === 'lifetime' ? 'payment' : 'subscription';
    console.log('Checkout mode:', mode);
    
    try {
      // Create a checkout session without hardcoded price IDs
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
        success_url: successUrl || 'https://rezume.dev/payment-success',
        cancel_url: cancelUrl || 'https://rezume.dev/pricing',
        client_reference_id: authenticatedUserId,
        customer_email: userEmail,
        metadata: {
          userId: authenticatedUserId,
          planType: planType,
        },
      };
      
      console.log('Creating checkout session with data:', JSON.stringify(sessionData, null, 2));
      const session = await stripe.checkout.sessions.create(sessionData);

      // Log the session creation
      console.log(`Checkout session created: ${session.id} for user: ${authenticatedUserId}, plan: ${planType}`);

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
