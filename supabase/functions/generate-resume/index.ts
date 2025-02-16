
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import html2canvas from "https://esm.sh/html2canvas@1.4.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeId, format } = await req.json();
    
    if (!resumeId || !format) {
      throw new Error('Missing required parameters');
    }

    console.log(`Generating ${format} for resume ${resumeId}`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch resume data
    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resume) {
      throw new Error('Resume not found');
    }

    let fileData: Uint8Array;
    let mimeType: string;
    let fileName: string;

    if (format === 'pdf') {
      // Initialize Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      // Get the resume preview URL (you'll need to replace this with your actual URL)
      const previewUrl = `${Deno.env.get('APP_URL')}/resume-preview/${resumeId}`;
      
      await page.goto(previewUrl, { waitUntil: 'networkidle0' });
      
      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
      });

      await browser.close();

      fileData = pdf;
      mimeType = 'application/pdf';
      fileName = `resume-${resumeId}.pdf`;
    } else if (format === 'docx') {
      // For DOCX, we'll use a simpler approach with basic formatting
      const docx = await generateDocx(resume); // You'll need to implement this function
      fileData = docx;
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileName = `resume-${resumeId}.docx`;
    } else {
      throw new Error('Unsupported format');
    }

    // Update download count
    await supabaseClient
      .from('resumes')
      .update({ downloads: (resume.downloads || 0) + 1 })
      .eq('id', resumeId);

    return new Response(
      fileData,
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        }
      }
    );
  } catch (error) {
    console.error('Error generating resume:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function generateDocx(resume: any): Promise<Uint8Array> {
  // Implement DOCX generation here
  // You might want to use a library like docx-templates or similar
  // For now, returning an empty array as placeholder
  return new Uint8Array();
}
