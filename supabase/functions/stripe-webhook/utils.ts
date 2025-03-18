
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import Stripe from 'https://esm.sh/stripe@13.10.0';

// Initialize environment variables with explicit error handling
export const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
export const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
export const supabaseUrl = Deno.env.get('SUPABASE_URL');
export const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Initialize Stripe client
export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceKey || ''
);

// Define CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Helper to create consistent error responses
export const errorResponse = (message: string, status = 400, details: any = null) => {
  console.error(`Error: ${message}`, details ? `Details: ${JSON.stringify(details)}` : '');
  return new Response(
    JSON.stringify({
      error: message,
      details: details
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Helper to create success responses
export const successResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Helper to validate environment
export const validateEnvironment = () => {
  if (!stripeSecretKey) {
    return 'STRIPE_SECRET_KEY is not configured';
  }
  
  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET is not configured - webhook signature validation will be disabled!');
  }
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return 'Supabase connection configuration is missing';
  }
  
  return null;
};

// Log environment configuration
export const logEnvironmentConfig = () => {
  console.log(`Stripe webhook function loaded. Environment check:
  - STRIPE_SECRET_KEY: ${stripeSecretKey ? 'Present' : 'MISSING'}
  - STRIPE_WEBHOOK_SECRET: ${webhookSecret ? 'Present' : 'MISSING'}
  - SUPABASE_URL: ${supabaseUrl ? 'Present' : 'MISSING'}
  - SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'Present' : 'MISSING'}`
  );
};
