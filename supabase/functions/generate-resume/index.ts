
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import * as docx from "https://esm.sh/docx@8.2.3";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { resumeTemplates } from "../../src/components/resume-builder/templates.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateHTMLContent = (resume: any, templateId: string) => {
  const template = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          width: 794px;
          height: 1123px;
          margin: 0;
          padding: 48px;
        }
        .resume-container {
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <!-- Header Section -->
        <div class="${template.style.headerStyle}">
          <h1 class="${template.style.titleFont}">${resume.personal_info.fullName}</h1>
          <h2 class="text-xl text-gray-600">${resume.professional_summary.title}</h2>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span>${resume.personal_info.email}</span>
            <span>${resume.personal_info.phone}</span>
            ${resume.personal_info.linkedin ? `<span>${resume.personal_info.linkedin}</span>` : ''}
          </div>
        </div>

        <div class="${template.style.contentStyle} mt-8 space-y-6">
          <!-- Professional Summary -->
          <div>
            <h3 class="${template.style.sectionStyle}">Professional Summary</h3>
            <div class="text-gray-600 mt-2">${resume.professional_summary.summary}</div>
          </div>

          <!-- Work Experience -->
          ${resume.work_experience.length > 0 ? `
            <div>
              <h3 class="${template.style.sectionStyle}">Work Experience</h3>
              <div class="space-y-4 mt-2">
                ${resume.work_experience.map(exp => `
                  <div>
                    <h4 class="font-medium">${exp.jobTitle}</h4>
                    <div class="text-gray-600">${exp.companyName}</div>
                    <div class="text-sm text-gray-500">
                      ${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}
                    </div>
                    <ul class="list-disc ml-4 mt-2 text-gray-600 space-y-1">
                      ${exp.responsibilities.map(resp => `
                        <li>${resp}</li>
                      `).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Education -->
          ${resume.education.length > 0 ? `
            <div>
              <h3 class="${template.style.sectionStyle}">Education</h3>
              <div class="space-y-4 mt-2">
                ${resume.education.map(edu => `
                  <div>
                    <h4 class="font-medium">${edu.degreeName}</h4>
                    <div class="text-gray-600">${edu.schoolName}</div>
                    <div class="text-sm text-gray-500">
                      ${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Skills -->
          ${(resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) ? `
            <div>
              <h3 class="${template.style.sectionStyle}">Skills</h3>
              <div class="grid grid-cols-2 gap-4 mt-2">
                ${resume.skills.hard_skills.length > 0 ? `
                  <div>
                    <h4 class="font-medium mb-2">Technical Skills</h4>
                    <div class="text-gray-600">
                      ${resume.skills.hard_skills.join(', ')}
                    </div>
                  </div>
                ` : ''}
                ${resume.skills.soft_skills.length > 0 ? `
                  <div>
                    <h4 class="font-medium mb-2">Soft Skills</h4>
                    <div class="text-gray-600">
                      ${resume.skills.soft_skills.join(', ')}
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
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
    
    if (!resumeId || !format) {
      throw new Error('Missing required parameters');
    }

    console.log(`Generating ${format} for resume ${resumeId}`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: resume, error: resumeError } = await supabaseClient
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resume) {
      throw new Error('Resume not found');
    }

    if (format === 'pdf') {
      // Generate HTML content
      const htmlContent = generateHTMLContent(resume, resume.template_id || 'minimal-clean');
      
      // Convert HTML to PDF using Chrome's built-in PDF generation (used through a service to avoid the need for browser dependencies)
      const response = await fetch('https://chrome.browserless.io/pdf', {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
          'Authorization': `Token ${Deno.env.get('BROWSERLESS_API_KEY')}`,
        },
        body: JSON.stringify({
          html: htmlContent,
          options: {
            format: 'A4',
            printBackground: true,
            margin: {
              top: '0',
              right: '0',
              bottom: '0',
              left: '0'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const pdfBuffer = await response.arrayBuffer();
      const fileBuffer = new Uint8Array(pdfBuffer);
      const base64String = base64Encode(fileBuffer);

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
    } else if (format === 'docx') {
      const fileBuffer = await generateDocx(resume);
      const base64String = base64Encode(fileBuffer);

      return new Response(
        JSON.stringify({ 
          data: base64String,
          format: 'docx',
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      throw new Error('Unsupported format');
    }
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
