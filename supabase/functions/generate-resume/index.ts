
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
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

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
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

    // Initialize browser with proper import
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Set viewport to A4 size
      await page.setViewport({ 
        width: 794,
        height: 1123,
        deviceScaleFactor: 2
      });

      console.log('Navigating to preview URL...');
      await page.goto(previewUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for the resume content
      console.log('Waiting for content to load...');
      await page.waitForSelector('#resume-content', { timeout: 10000 });

      let fileData;
      let contentType;

      if (format === 'pdf') {
        console.log('Generating PDF...');
        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });
        fileData = base64Encode(pdf);
        contentType = 'application/pdf';
      } else {
        console.log('Generating DOCX...');
        const htmlContent = await page.content();
        fileData = base64Encode(new TextEncoder().encode(htmlContent));
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }

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
    } finally {
      await browser.close();
    }
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
