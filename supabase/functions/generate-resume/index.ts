
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import * as docx from "https://esm.sh/docx@8.2.3";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

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
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });

      // Constants for layout
      const margin = 48; // Matching the preview's padding
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const usableWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Personal Section
      doc.setFontSize(28);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      const fullName = resume.personal_info.fullName;
      doc.text(fullName, margin, currentY);
      currentY += 25;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const title = resume.professional_summary.title;
      doc.text(title, margin, currentY);
      currentY += 20;

      // Contact Info
      doc.setFontSize(11);
      doc.setTextColor(128, 128, 128);
      const contactInfoParts = [
        resume.personal_info.email,
        resume.personal_info.phone,
        resume.personal_info.linkedin
      ].filter(Boolean);
      
      doc.text(contactInfoParts.join(' • '), margin, currentY);
      currentY += 40;

      // Professional Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Professional Summary', margin, currentY);
      currentY += 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(96, 96, 96);
      const summaryLines = doc.splitTextToSize(resume.professional_summary.summary, usableWidth);
      doc.text(summaryLines, margin, currentY);
      currentY += (summaryLines.length * 15) + 30;

      // Work Experience
      if (resume.work_experience.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Work Experience', margin, currentY);
        currentY += 20;

        resume.work_experience.forEach((exp, index) => {
          if (currentY > pageHeight - 100) {
            doc.addPage();
            currentY = margin;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(exp.jobTitle, margin, currentY);
          currentY += 15;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(96, 96, 96);
          doc.text(exp.companyName, margin, currentY);
          currentY += 15;

          doc.setTextColor(128, 128, 128);
          doc.text(`${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, margin, currentY);
          currentY += 20;

          exp.responsibilities.forEach(resp => {
            if (currentY > pageHeight - 100) {
              doc.addPage();
              currentY = margin;
            }

            const bulletPoint = '•';
            const respLines = doc.splitTextToSize(resp, usableWidth - 15);
            doc.text(bulletPoint, margin, currentY);
            doc.text(respLines, margin + 15, currentY);
            currentY += (respLines.length * 15);
          });

          if (index < resume.work_experience.length - 1) {
            currentY += 25;
          }
        });
        currentY += 30;
      }

      // Education
      if (resume.education.length > 0) {
        if (currentY > pageHeight - 200) {
          doc.addPage();
          currentY = margin;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Education', margin, currentY);
        currentY += 20;

        resume.education.forEach((edu, index) => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(edu.schoolName, margin, currentY);
          currentY += 15;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(96, 96, 96);
          doc.text(edu.degreeName, margin, currentY);
          currentY += 15;

          doc.setTextColor(128, 128, 128);
          doc.text(`${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`, margin, currentY);
          
          if (index < resume.education.length - 1) {
            currentY += 25;
          }
        });
        currentY += 30;
      }

      // Skills
      if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
        if (currentY > pageHeight - 200) {
          doc.addPage();
          currentY = margin;
        }

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Skills', margin, currentY);
        currentY += 20;

        const skillsColumnWidth = (usableWidth - margin) / 2;

        if (resume.skills.hard_skills.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Technical Skills', margin, currentY);
          currentY += 15;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(96, 96, 96);
          const hardSkillsText = resume.skills.hard_skills.join(' • ');
          const hardSkillsLines = doc.splitTextToSize(hardSkillsText, skillsColumnWidth);
          doc.text(hardSkillsLines, margin, currentY);
          currentY += (hardSkillsLines.length * 15) + 20;
        }

        if (resume.skills.soft_skills.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text('Soft Skills', margin, currentY);
          currentY += 15;

          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(96, 96, 96);
          const softSkillsText = resume.skills.soft_skills.join(' • ');
          const softSkillsLines = doc.splitTextToSize(softSkillsText, skillsColumnWidth);
          doc.text(softSkillsLines, margin, currentY);
        }
      }

      fileBuffer = new Uint8Array(doc.output('arraybuffer'));
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
                top: 1440, // 1 inch in twips
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
                }),
              ] : []),
            ] : []),
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
