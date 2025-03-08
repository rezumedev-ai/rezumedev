
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { renderAsync } from "npm:@react-email/render@0.0.9";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { MagicLinkEmail } from "./_templates/magic-link.tsx";
import { ResetPasswordEmail } from "./_templates/reset-password.tsx";
import { ConfirmationEmail } from "./_templates/confirmation.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = "signup" | "magiclink" | "recovery" | "invite" | "change_email";

// Handle CORS preflight requests
async function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Handle webhook authorization
function isAuthorized(request: Request): boolean {
  // Get the authorization header from the request
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return false;
  }
  
  const webhookSecret = Deno.env.get("AUTH_WEBHOOK_SECRET");
  // If we haven't set a webhook secret, disallow the request
  if (!webhookSecret) {
    console.error("AUTH_WEBHOOK_SECRET is not set");
    return false;
  }
  
  // Check if the authorization header matches our webhook secret
  return authHeader === `Bearer ${webhookSecret}`;
}

serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = await handleCors(req);
    if (corsResponse) return corsResponse;
    
    // Check if the request is authorized
    if (!isAuthorized(req)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const payload = await req.json();
    const { type, email, data } = payload;
    
    let html = "";
    
    // Render the appropriate email template
    switch (type as EmailType) {
      case "signup":
      case "change_email":
        // Email confirmation link
        html = await renderAsync(
          ConfirmationEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            confirmLink: data.confirm_url,
          })
        );
        break;
      
      case "magiclink":
        // Magic link email
        html = await renderAsync(
          MagicLinkEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            magicLink: data.link,
          })
        );
        break;
      
      case "recovery":
        // Password reset email
        html = await renderAsync(
          ResetPasswordEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            resetLink: data.link,
          })
        );
        break;
      
      default:
        throw new Error(`Email type not supported: ${type}`);
    }
    
    // Return the rendered HTML
    return new Response(JSON.stringify({ html }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error(`Error in auth-email-templates: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
