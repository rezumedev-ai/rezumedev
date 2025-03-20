
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

// Define very permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Log every request
  console.log("WEBHOOK REQUEST RECEIVED:");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  
  // Log all headers
  console.log("Headers:");
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Responding to OPTIONS request");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // For any request type, try to get the body text
    let bodyText = '';
    try {
      bodyText = await req.text();
      console.log("Request body:", bodyText);
    } catch (e) {
      console.error("Error reading request body:", e);
      bodyText = 'Could not read body: ' + e.message;
    }

    // For simplicity, always return success
    console.log("Responding with success");
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook received",
        bodyLength: bodyText.length
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { 
        status: 200, // Still return 200 to avoid Stripe retries
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
