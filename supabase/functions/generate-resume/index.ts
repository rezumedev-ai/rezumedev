
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { encode as base64Encode } from "https://deno.land/std@0.182.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { resumeId, format } = await req.json()
    console.log('Processing request for resumeId:', resumeId, 'format:', format);

    if (!resumeId) {
      throw new Error('Resume ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const browserlessApiKey = Deno.env.get('BROWSERLESS_API_KEY');

    if (!supabaseUrl || !supabaseKey || !browserlessApiKey) {
      throw new Error('Required configuration is missing');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get resume data
    console.log('Fetching resume data...');
    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .maybeSingle();

    if (resumeError) {
      console.error('Resume fetch error:', resumeError);
      throw new Error(`Failed to fetch resume data: ${resumeError.message}`);
    }

    if (!resume) {
      throw new Error('Resume not found');
    }

    console.log('Resume data fetched successfully');

    // Get the frontend URL from the request origin
    const origin = req.headers.get('origin');
    if (!origin) {
      throw new Error('Request origin not found');
    }

    const previewUrl = `${origin}/resume-preview/${resumeId}`;
    console.log('Preview URL:', previewUrl);

    // Generate PDF using Browserless API
    console.log('Generating document using Browserless...');
    const response = await fetch('https://chrome.browserless.io/pdf', {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Authorization': browserlessApiKey,
      },
      body: JSON.stringify({
        url: previewUrl,
        options: {
          printBackground: true,
          format: 'A4',
          margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
          },
          waitFor: '#resume-content'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Browserless API error: ${response.statusText}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    const fileData = base64Encode(new Uint8Array(pdfBuffer));
    const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    console.log('File generated successfully');
    return new Response(
      JSON.stringify({
        data: fileData,
        contentType
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error generating document:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate document',
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});
