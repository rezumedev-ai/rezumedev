
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateHTMLContent = (resume: any, templateId: string) => {
  // Convert the resume data into properly formatted HTML with embedded styles
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${resume.personal_info.fullName} - Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        /* Reset CSS */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          color: #1a1a1a;
          background: white;
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 48px;
        }

        /* Header Styles */
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .header h2 {
          font-size: 20px;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .contact-info {
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* Section Styles */
        .section {
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        /* Content Styles */
        .content {
          font-size: 14px;
          color: #4a5568;
        }

        .experience-item, .education-item, .certification-item {
          margin-bottom: 1rem;
        }

        .item-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .item-subtitle {
          color: #718096;
          margin-bottom: 0.25rem;
        }

        .item-date {
          font-size: 12px;
          color: #a0aec0;
        }

        .responsibilities {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .responsibilities li {
          margin-bottom: 0.25rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .skills-category {
          margin-bottom: 1rem;
        }

        .skills-category h4 {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resume.personal_info.fullName}</h1>
        <h2>${resume.professional_summary.title}</h2>
        <div class="contact-info">
          <span>${resume.personal_info.email}</span>
          <span>${resume.personal_info.phone}</span>
          ${resume.personal_info.linkedin ? `<span>${resume.personal_info.linkedin}</span>` : ''}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Professional Summary</h3>
        <div class="content">
          <p>${resume.professional_summary.summary}</p>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Work Experience</h3>
        <div class="content">
          ${resume.work_experience.map(exp => `
            <div class="experience-item">
              <div class="item-title">${exp.jobTitle}</div>
              <div class="item-subtitle">${exp.companyName}</div>
              <div class="item-date">
                ${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}
              </div>
              <ul class="responsibilities">
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Education</h3>
        <div class="content">
          ${resume.education.map(edu => `
            <div class="education-item">
              <div class="item-title">${edu.degreeName}</div>
              <div class="item-subtitle">${edu.schoolName}</div>
              <div class="item-date">
                ${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Skills</h3>
        <div class="content skills-grid">
          <div class="skills-category">
            <h4>Technical Skills</h4>
            <div class="skills-list">
              ${resume.skills.hard_skills.join(', ')}
            </div>
          </div>
          <div class="skills-category">
            <h4>Soft Skills</h4>
            <div class="skills-list">
              ${resume.skills.soft_skills.join(', ')}
            </div>
          </div>
        </div>
      </div>

      ${resume.certifications.length > 0 ? `
        <div class="section">
          <h3 class="section-title">Certifications</h3>
          <div class="content">
            ${resume.certifications.map(cert => `
              <div class="certification-item">
                <div class="item-title">${cert.name}</div>
                <div class="item-subtitle">${cert.organization}</div>
                <div class="item-date">${cert.completionDate}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
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
    console.log('Processing request:', { resumeId, format });

    if (!resumeId || !format) {
      throw new Error('Missing required parameters');
    }

    // Fetch resume data
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
      console.error('Resume fetch error:', resumeError);
      throw new Error('Resume not found');
    }

    if (format === 'pdf') {
      try {
        const htmlContent = generateHTMLContent(resume, resume.template_id || 'minimal-clean');
        console.log('HTML content generated');

        const browserlessKey = Deno.env.get('BROWSERLESS_API_KEY');
        if (!browserlessKey) {
          throw new Error('Browserless API key is not configured');
        }

        console.log('Sending request to Browserless API');
        const response = await fetch('https://chrome.browserless.io/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${browserlessKey}`,
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
            html: htmlContent,
            options: {
              printBackground: true,
              preferCSSPageSize: true,
              format: 'A4',
              margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
              }
            }
          })
        });

        console.log('Browserless response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Browserless error:', {
            status: response.status,
            text: errorText
          });
          throw new Error(`PDF generation failed: ${errorText}`);
        }

        const pdfBuffer = await response.arrayBuffer();
        const fileBuffer = new Uint8Array(pdfBuffer);
        const base64String = base64Encode(fileBuffer);
        console.log('PDF generated successfully');

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
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else if (format === 'docx') {
      // For DOCX format, we'll return an error for now
      return new Response(
        JSON.stringify({ error: 'DOCX format is not yet supported' }),
        {
          status: 501,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      throw new Error('Unsupported format');
    }
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
