import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import * as docx from "https://esm.sh/docx@8.2.3";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateHTML = (resume: any, templateId: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      width: 794px;
      height: 1123px;
      margin: 0;
      padding: 48px;
      box-sizing: border-box;
    }
    .resume-container {
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Personal Info Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">${resume.personal_info.fullName}</h1>
      <h2 class="text-xl text-gray-600 mb-2">${resume.professional_summary.title}</h2>
      <div class="text-sm text-gray-500 space-x-4">
        <span>${resume.personal_info.email}</span>
        <span>${resume.personal_info.phone}</span>
        ${resume.personal_info.linkedin ? `<span>${resume.personal_info.linkedin}</span>` : ''}
      </div>
    </div>

    <!-- Professional Summary -->
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-2 uppercase tracking-wide">Professional Summary</h3>
      <p class="text-gray-600 text-sm">${resume.professional_summary.summary}</p>
    </div>

    <!-- Work Experience -->
    ${resume.work_experience.length > 0 ? `
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-2 uppercase tracking-wide">Work Experience</h3>
      <div class="space-y-4">
        ${resume.work_experience.map(exp => `
          <div>
            <h4 class="text-sm font-medium">${exp.jobTitle}</h4>
            <div class="text-sm text-gray-600">${exp.companyName}</div>
            <div class="text-sm text-gray-500">${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}</div>
            <ul class="text-sm text-gray-600 space-y-1 list-disc ml-4 mt-2">
              ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Education -->
    ${resume.education.length > 0 ? `
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-2 uppercase tracking-wide">Education</h3>
      <div class="space-y-4">
        ${resume.education.map(edu => `
          <div>
            <div class="font-medium text-sm">${edu.schoolName}</div>
            <div class="text-sm text-gray-600">${edu.degreeName}</div>
            <div class="text-sm text-gray-500">${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Skills -->
    ${(resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) ? `
    <div class="mb-8">
      <h3 class="text-base font-semibold mb-2 uppercase tracking-wide">Skills</h3>
      <div class="grid grid-cols-2 gap-4">
        ${resume.skills.hard_skills.length > 0 ? `
        <div>
          <h4 class="font-medium text-sm mb-2">Technical Skills</h4>
          <div class="text-sm text-gray-600">${resume.skills.hard_skills.join(' • ')}</div>
        </div>
        ` : ''}
        ${resume.skills.soft_skills.length > 0 ? `
        <div>
          <h4 class="font-medium text-sm mb-2">Soft Skills</h4>
          <div class="text-sm text-gray-600">${resume.skills.soft_skills.join(' • ')}</div>
        </div>
        ` : ''}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>
`;

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

    // Also fetch the template data
    const { data: templateData } = await supabaseClient
      .from('resumes')
      .select('template_id')
      .eq('id', resumeId)
      .single();

    const templateId = templateData?.template_id || 'minimal-clean';

    let fileBuffer: Uint8Array;

    if (format === 'pdf') {
      // Launch Puppeteer
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      try {
        const page = await browser.newPage();
        
        // Set viewport to A4 size
        await page.setViewport({
          width: 794,  // A4 width at 96 DPI
          height: 1123, // A4 height at 96 DPI
          deviceScaleFactor: 2, // Higher resolution
        });

        // Generate and set HTML content
        const html = generateHTML(resume, templateId);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0'
          }
        });

        fileBuffer = new Uint8Array(pdfBuffer);
      } finally {
        await browser.close();
      }
    } else if (format === 'docx') {
      const spacingAfterSection = 400;
      const doc = new docx.Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Helvetica",
                size: 24,
                color: "000000",
              },
            },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            // Header with Name
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.personal_info.fullName,
                  bold: true,
                  size: 48,
                }),
              ],
              spacing: { after: 240 },
            }),

            // Job Title
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.professional_summary.title,
                  size: 32,
                  color: "666666",
                }),
              ],
              spacing: { after: 240 },
            }),

            // Contact Info
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: [
                    resume.personal_info.email,
                    resume.personal_info.phone,
                    resume.personal_info.linkedin
                  ].filter(Boolean).join(" • "),
                  size: 22,
                  color: "666666",
                }),
              ],
              spacing: { after: spacingAfterSection },
            }),

            // Professional Summary
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "Professional Summary",
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { after: 240 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.professional_summary.summary,
                  size: 22,
                  color: "666666",
                }),
              ],
              spacing: { after: spacingAfterSection },
            }),

            // Work Experience
            ...(resume.work_experience.length > 0 ? [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Work Experience",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 240 },
              }),
              ...resume.work_experience.flatMap(exp => [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: exp.jobTitle,
                      bold: true,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: exp.companyName,
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`,
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 240 },
                }),
                ...exp.responsibilities.map(resp =>
                  new docx.Paragraph({
                    bullet: {
                      level: 0,
                    },
                    children: [
                      new docx.TextRun({
                        text: resp,
                        size: 22,
                        color: "666666",
                      }),
                    ],
                    spacing: { after: 120 },
                  })
                ),
                new docx.Paragraph({
                  children: [],
                  spacing: { after: 240 },
                }),
              ]),
            ] : []),

            // Education
            ...(resume.education.length > 0 ? [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Education",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 240 },
              }),
              ...resume.education.flatMap(edu => [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: edu.schoolName,
                      bold: true,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: edu.degreeName,
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`,
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: spacingAfterSection },
                }),
              ]),
            ] : []),

            // Skills
            ...(resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0 ? [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Skills",
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { after: 240 },
              }),
              ...(resume.skills.hard_skills.length > 0 ? [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Technical Skills",
                      bold: true,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.hard_skills.join(" • "),
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 240 },
                }),
              ] : []),
              ...(resume.skills.soft_skills.length > 0 ? [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Soft Skills",
                      bold: true,
                      size: 24,
                    }),
                  ],
                  spacing: { after: 120 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.soft_skills.join(" • "),
                      size: 22,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 240 },
                }),
              ] : [])
            ] : [])
          ],
        }],
      });

      fileBuffer = await docx.Packer.toBuffer(doc);
    } else {
      throw new Error('Unsupported format');
    }

    const base64String = base64Encode(fileBuffer);
    console.log("File generated successfully, size:", fileBuffer.length);

    return new Response(
      JSON.stringify({ 
        data: base64String,
        format,
        contentType: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
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
