
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
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

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get resume data
    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single()

    if (resumeError) {
      throw new Error('Failed to fetch resume data')
    }

    // Get the preview URL for the resume
    const previewUrl = `${Deno.env.get('FRONTEND_URL')}/resume-preview/${resumeId}`

    // Initialize browser
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox'],
      headless: true 
    })

    try {
      const page = await browser.newPage()
      
      // Set viewport to A4 size
      await page.setViewport({ 
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        deviceScaleFactor: 2 // For better quality
      })

      // Navigate to the preview URL
      await page.goto(previewUrl, { waitUntil: 'networkidle0' })

      // Wait for the resume content to load
      await page.waitForSelector('.resume-content')

      let fileData;
      let contentType;

      if (format === 'pdf') {
        // Generate PDF
        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' }
        })
        fileData = base64Encode(pdf)
        contentType = 'application/pdf'
      } else {
        // For DOCX, we'll need to convert the HTML content
        // This is a simplified version, you might want to use a proper HTML to DOCX converter
        const htmlContent = await page.content()
        // Convert HTML to DOCX using a library or service
        // For now, we'll just return a simple DOCX
        fileData = base64Encode(new TextEncoder().encode(htmlContent))
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }

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
      )
    } finally {
      await browser.close()
    }
  } catch (error) {
    console.error('Error generating document:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate document' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
