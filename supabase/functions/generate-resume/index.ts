
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified test HTML to verify Browserless connection
const generateSimpleHTML = () => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test PDF</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
      </style>
    </head>
    <body>
      <h1>Test PDF Generation</h1>
      <p>This is a test document.</p>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeId, format } = await req.json();
    
    console.log('Request received:', { resumeId, format });
    
    if (!resumeId || !format) {
      throw new Error('Missing required parameters');
    }

    if (format === 'pdf') {
      try {
        // Test with simple HTML first
        const htmlContent = generateSimpleHTML();
        console.log('Generated simple test HTML');

        const browserlessKey = Deno.env.get('BROWSERLESS_API_KEY');
        if (!browserlessKey) {
          console.error('Browserless API key is missing');
          throw new Error('Browserless API key is not configured');
        }

        console.log('Testing Browserless API connection...');
        const response = await fetch('https://chrome.browserless.io/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${browserlessKey}`,
          },
          body: JSON.stringify({
            html: htmlContent,
            options: {
              printBackground: true,
              format: 'A4',
              margin: {
                top: '1cm',
                right: '1cm',
                bottom: '1cm',
                left: '1cm'
              }
            }
          })
        });

        console.log('Browserless response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Browserless error details:', {
            status: response.status,
            statusText: response.statusText,
            errorText,
            headers: Object.fromEntries(response.headers.entries())
          });
          throw new Error(`Browserless API error (${response.status}): ${errorText}`);
        }

        const pdfBuffer = await response.arrayBuffer();
        const fileBuffer = new Uint8Array(pdfBuffer);
        const base64String = base64Encode(fileBuffer);
        console.log('Test PDF generated successfully');

        return new Response(
          JSON.stringify({ 
            data: base64String,
            format: 'pdf',
            contentType: 'application/pdf'
          }),
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('PDF generation error:', error);
        return new Response(
          JSON.stringify({ 
            error: `PDF Generation failed: ${error.message}`,
            details: error.stack
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      throw new Error('Unsupported format');
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
