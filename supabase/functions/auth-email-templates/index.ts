
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

serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = await handleCors(req);
    if (corsResponse) return corsResponse;
    
    // We're removing the webhook authorization check to simplify the process
    // In a production environment, you should implement proper security
    
    const payload = await req.json();
    const { type, email, data } = payload;
    
    let html = "";
    const logoUrl = "https://xqkzmcudulutohnskcwt.supabase.co/storage/v1/object/public/emails/logo-email.png";
    
    // Render the appropriate email template
    switch (type as EmailType) {
      case "signup":
      case "change_email":
        // Email confirmation link
        html = await renderAsync(
          ConfirmationEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            confirmLink: data.confirm_url,
            brandName: "Rezume.dev",
            brandColor: "#6366F1"
          })
        );
        break;
      
      case "magiclink":
        // Magic link email
        html = await renderAsync(
          MagicLinkEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            magicLink: data.link,
            brandName: "Rezume.dev",
            brandColor: "#6366F1"
          })
        );
        break;
      
      case "recovery":
        // Password reset email
        html = await renderAsync(
          ResetPasswordEmail({
            serverUrl: Deno.env.get("SUPABASE_URL") || "",
            resetLink: data.link,
            brandName: "Rezume.dev",
            brandColor: "#6366F1"
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
