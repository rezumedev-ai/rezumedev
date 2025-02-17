
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateHTMLContent = (resume: any, templateId: string) => {
  // Include the complete CSS from our application
  const fullCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    /* Base Tailwind styles */
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
    
    /* Custom styles that match our app exactly */
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 222.2 47.4% 11.2%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
      --radius: 0.5rem;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Resume specific styles */
    .resume-container {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      padding: 48px;
      background: white;
      position: relative;
    }

    /* Grid layouts */
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }

    /* Spacing */
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    
    /* Text styles */
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }
    
    /* Colors */
    .text-gray-500 { color: #6b7280; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-700 { color: #374151; }
    
    /* Lists */
    .list-disc { list-style-type: disc; }
    .ml-4 { margin-left: 1rem; }
    
    /* Flexbox */
    .flex { display: flex; }
    .flex-wrap { flex-wrap: wrap; }
    .gap-4 { gap: 1rem; }
    
    /* Borders */
    .border-b { border-bottom-width: 1px; }
    .border-gray-200 { border-color: #e5e7eb; }
    .border-gray-900 { border-color: #111827; }
    
    /* Template specific styles */
    .template-header { margin-bottom: 2rem; }
    .template-section { margin-bottom: 1.5rem; }
  `;

  const template = {
    minimal: {
      headerStyle: "text-center space-y-2 mb-8",
      sectionStyle: "border-b border-gray-200 pb-2 mb-4 text-lg font-semibold",
      contentStyle: "space-y-4",
      titleFont: "text-4xl font-bold tracking-tight"
    },
    modern: {
      headerStyle: "border-b border-gray-900 pb-6 mb-8",
      sectionStyle: "text-xl uppercase tracking-wide font-semibold mb-6",
      contentStyle: "grid grid-cols-[1fr_3fr] gap-12",
      titleFont: "text-5xl font-bold tracking-tight"
    }
  }[templateId] || template.minimal;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${fullCSS}</style>
    </head>
    <body>
      <div class="resume-container">
        <div class="${template.headerStyle}">
          <h1 class="${template.titleFont}">${resume.personal_info.fullName}</h1>
          <h2 class="text-xl text-gray-600">${resume.professional_summary.title}</h2>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span>${resume.personal_info.email}</span>
            <span>${resume.personal_info.phone}</span>
            ${resume.personal_info.linkedin ? `<span>${resume.personal_info.linkedin}</span>` : ''}
          </div>
        </div>

        <div class="${template.contentStyle} mt-8">
          <div class="space-y-6">
            <div>
              <h3 class="${template.sectionStyle}">Professional Summary</h3>
              <div class="text-gray-600">${resume.professional_summary.summary}</div>
            </div>

            ${resume.work_experience.length > 0 ? `
              <div>
                <h3 class="${template.sectionStyle}">Work Experience</h3>
                <div class="space-y-4">
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

            ${resume.education.length > 0 ? `
              <div>
                <h3 class="${template.sectionStyle}">Education</h3>
                <div class="space-y-4">
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

            ${(resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) ? `
              <div>
                <h3 class="${template.sectionStyle}">Skills</h3>
                <div class="grid grid-cols-2 gap-4">
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
      // Generate HTML content with exact styling
      const htmlContent = generateHTMLContent(resume, resume.template_id || 'minimal-clean');
      
      // Use Browserless to generate PDF with exact dimensions and styling
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
            preferCSSPageSize: true,
            margin: {
              top: '0mm',
              right: '0mm',
              bottom: '0mm',
              left: '0mm'
            },
            viewport: {
              width: 794,
              height: 1123
            }
          }
        })
      });

      if (!response.ok) {
        console.error('PDF generation failed:', await response.text());
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
