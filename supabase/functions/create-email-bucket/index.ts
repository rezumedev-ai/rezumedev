
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Create email assets bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }
    
    const emailBucket = buckets.find(bucket => bucket.name === 'emails');
    
    if (!emailBucket) {
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('emails', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
      
      if (createBucketError) {
        throw createBucketError;
      }
      
      // Set public policy to allow access to the email assets
      const { error: policyError } = await supabase
        .storage
        .from('emails')
        .createSignedUrl('path/to/file', 60);
      
      if (policyError && !policyError.message.includes('The resource was not found')) {
        throw policyError;
      }
      
      // Try to upload the logo if we can find it in the public folder
      try {
        // For demonstration, we're creating a fetch to get the logo from public
        // In a real scenario, we would upload the logo from a local file
        const logoResponse = await fetch("http://localhost:5173/lovable-uploads/1de1d500-e16a-46d6-9037-19cf6739f790.png");
        
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          
          const { error: uploadError } = await supabase
            .storage
            .from('emails')
            .upload('logo-email.png', logoBlob, {
              contentType: 'image/png',
              upsert: true,
            });
          
          if (uploadError) {
            console.error(`Error uploading logo: ${uploadError.message}`);
          }
        }
      } catch (logoError) {
        console.error(`Error fetching or uploading logo: ${logoError.message}`);
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
