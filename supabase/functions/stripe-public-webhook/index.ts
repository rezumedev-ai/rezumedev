
// Very simple public webhook receiver for Stripe
// No authentication, no verification, just receives and logs the payload

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Maximum permissive CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// This is a completely public endpoint
Deno.serve(async (req) => {
  console.log("==========================================");
  console.log("NEW PUBLIC WEBHOOK REQUEST RECEIVED");
  console.log("==========================================");
  
  // Log all request details
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  
  // Log all headers
  console.log("Request headers:");
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Handle OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    console.log("Responding to OPTIONS request with 200 OK");
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    // For POST requests, try to process the body
    if (req.method === 'POST') {
      console.log("Processing POST request");
      
      // Get the raw body
      const body = await req.text();
      console.log("Request body length:", body.length);
      console.log("Request body preview:", body.substring(0, 200));
      
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(body);
        console.log("Event type:", jsonData.type);
        
        // Handle checkout session completed event
        if (jsonData.type === 'checkout.session.completed') {
          const session = jsonData.data.object;
          console.log("Processing checkout.session.completed");
          
          // Get user ID and plan type
          const userId = session.metadata?.userId || session.client_reference_id;
          const planType = session.metadata?.planType;
          
          if (userId) {
            console.log(`Updating user ${userId} with plan ${planType}`);
            
            // Update user profile
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
              console.error('Database error:', error);
            } else {
              console.log('User subscription updated successfully');
            }
          }
        }
      } catch (err) {
        console.log("Failed to parse JSON:", err.message);
      }
    }
    
    // Always return 200 OK for any request
    console.log("Returning 200 OK response");
    return new Response(
      JSON.stringify({ success: true, message: "Webhook received" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    // Even for errors, return 200 OK to prevent Stripe from retrying
    console.error("Error processing webhook:", err);
    return new Response(
      JSON.stringify({ success: true, message: "Error logged but accepting webhook" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
