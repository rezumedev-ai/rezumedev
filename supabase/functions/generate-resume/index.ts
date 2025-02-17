import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import * as docx from "https://esm.sh/docx@8.2.3";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      const { width, height } = page.getSize();
      
      // Font setup
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const margin = 48; // 48 points margin
      let yOffset = height - margin; // Start from top
      const lineHeight = 15;
      
      // Helper function to write text and update yOffset
      const writeText = (text: string, {
        font = helveticaFont,
        fontSize = 11,
        color = rgb(0, 0, 0),
        indent = 0
      } = {}) => {
        page.drawText(text, {
          x: margin + indent,
          y: yOffset,
          font,
          size: fontSize,
          color
        });
        yOffset -= lineHeight;
      };

      // Personal Info Section
      writeText(resume.personal_info.fullName, { font: helveticaBold, fontSize: 24 });
      yOffset -= 5;
      writeText(resume.professional_summary.title, { fontSize: 16, color: rgb(0.4, 0.4, 0.4) });
      yOffset -= 5;
      
      const contactInfo = [
        resume.personal_info.email,
        resume.personal_info.phone,
        resume.personal_info.linkedin
      ].filter(Boolean).join(' • ');
      writeText(contactInfo, { fontSize: 11, color: rgb(0.5, 0.5, 0.5) });
      yOffset -= 20;

      // Professional Summary
      writeText('Professional Summary', { font: helveticaBold, fontSize: 14 });
      yOffset -= 10;
      writeText(resume.professional_summary.summary, { color: rgb(0.4, 0.4, 0.4) });
      yOffset -= 20;

      // Work Experience
      if (resume.work_experience.length > 0) {
        writeText('Work Experience', { font: helveticaBold, fontSize: 14 });
        yOffset -= 10;

        resume.work_experience.forEach((exp, index) => {
          writeText(exp.jobTitle, { font: helveticaBold, fontSize: 12 });
          writeText(exp.companyName, { color: rgb(0.4, 0.4, 0.4) });
          writeText(`${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, { 
            color: rgb(0.5, 0.5, 0.5) 
          });
          yOffset -= 5;

          exp.responsibilities.forEach(resp => {
            writeText(`• ${resp}`, { color: rgb(0.4, 0.4, 0.4), indent: 15 });
          });

          if (index < resume.work_experience.length - 1) {
            yOffset -= 10;
          }
        });
        yOffset -= 20;
      }

      // Education
      if (resume.education.length > 0) {
        writeText('Education', { font: helveticaBold, fontSize: 14 });
        yOffset -= 10;

        resume.education.forEach((edu, index) => {
          writeText(edu.schoolName, { font: helveticaBold, fontSize: 12 });
          writeText(edu.degreeName, { color: rgb(0.4, 0.4, 0.4) });
          writeText(`${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`, {
            color: rgb(0.5, 0.5, 0.5)
          });

          if (index < resume.education.length - 1) {
            yOffset -= 10;
          }
        });
        yOffset -= 20;
      }

      // Skills
      if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
        writeText('Skills', { font: helveticaBold, fontSize: 14 });
        yOffset -= 10;

        if (resume.skills.hard_skills.length > 0) {
          writeText('Technical Skills', { font: helveticaBold, fontSize: 12 });
          writeText(resume.skills.hard_skills.join(' • '), { color: rgb(0.4, 0.4, 0.4) });
          yOffset -= 10;
        }

        if (resume.skills.soft_skills.length > 0) {
          writeText('Soft Skills', { font: helveticaBold, fontSize: 12 });
          writeText(resume.skills.soft_skills.join(' • '), { color: rgb(0.4, 0.4, 0.4) });
        }
      }

      fileBuffer = await pdfDoc.save();
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
