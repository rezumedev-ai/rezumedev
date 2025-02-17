
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import * as docx from "https://esm.sh/docx@8.2.3";

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

    let fileBuffer: Uint8Array;

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });

      // Add font for better text rendering
      doc.setFont('helvetica');
      
      // Constants for layout
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      const name = resume.personal_info.fullName;
      doc.text(name, margin, currentY);
      currentY += 25;

      // Title
      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      const title = resume.professional_summary.title;
      doc.text(title, margin, currentY);
      currentY += 30;

      // Contact Info
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const contactInfo = [
        resume.personal_info.email,
        resume.personal_info.phone,
        resume.personal_info.linkedin
      ].filter(Boolean);
      
      contactInfo.forEach(info => {
        doc.text(info, margin, currentY);
        currentY += 15;
      });
      currentY += 20;

      // Professional Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Professional Summary', margin, currentY);
      currentY += 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(resume.professional_summary.summary, usableWidth);
      doc.text(summaryLines, margin, currentY);
      currentY += (summaryLines.length * 15) + 25;

      // Work Experience
      if (resume.work_experience.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Work Experience', margin, currentY);
        currentY += 20;

        resume.work_experience.forEach(exp => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(exp.jobTitle, margin, currentY);
          currentY += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(exp.companyName, margin, currentY);
          currentY += 15;

          doc.setTextColor(100, 100, 100);
          doc.text(`${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, margin, currentY);
          currentY += 20;

          doc.setTextColor(0, 0, 0);
          exp.responsibilities.forEach(resp => {
            const bulletPoint = '•';
            const respLines = doc.splitTextToSize(resp, usableWidth - 15);
            doc.text(bulletPoint, margin, currentY);
            doc.text(respLines, margin + 15, currentY);
            currentY += (respLines.length * 15);
          });
          currentY += 20;
        });
      }

      // Education
      if (resume.education.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Education', margin, currentY);
        currentY += 20;

        resume.education.forEach(edu => {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(edu.schoolName, margin, currentY);
          currentY += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(edu.degreeName, margin, currentY);
          currentY += 15;

          doc.setTextColor(100, 100, 100);
          doc.text(`${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`, margin, currentY);
          currentY += 25;
        });
      }

      // Skills
      if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Skills', margin, currentY);
        currentY += 20;

        if (resume.skills.hard_skills.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Technical Skills', margin, currentY);
          currentY += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const hardSkillsText = resume.skills.hard_skills.join(', ');
          const hardSkillsLines = doc.splitTextToSize(hardSkillsText, usableWidth);
          doc.text(hardSkillsLines, margin, currentY);
          currentY += (hardSkillsLines.length * 15) + 20;
        }

        if (resume.skills.soft_skills.length > 0) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('Soft Skills', margin, currentY);
          currentY += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const softSkillsText = resume.skills.soft_skills.join(', ');
          const softSkillsLines = doc.splitTextToSize(softSkillsText, usableWidth);
          doc.text(softSkillsLines, margin, currentY);
        }
      }

      fileBuffer = new Uint8Array(doc.output('arraybuffer'));
    } else if (format === 'docx') {
      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.personal_info.fullName,
                  bold: true,
                  size: 36,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Title
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.professional_summary.title,
                  size: 28,
                  color: "666666",
                }),
              ],
              spacing: { after: 200 },
            }),

            // Contact Info
            new docx.Paragraph({
              children: [
                new docx.TextRun({ text: resume.personal_info.email, size: 20 }),
                new docx.TextRun({ text: " | ", size: 20 }),
                new docx.TextRun({ text: resume.personal_info.phone, size: 20 }),
                ...(resume.personal_info.linkedin ? [
                  new docx.TextRun({ text: " | ", size: 20 }),
                  new docx.TextRun({ text: resume.personal_info.linkedin, size: 20 }),
                ] : []),
              ],
              spacing: { after: 400 },
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
              spacing: { after: 200 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.professional_summary.summary,
                  size: 24,
                }),
              ],
              spacing: { after: 400 },
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
                spacing: { after: 200 },
              }),
              ...resume.work_experience.flatMap(exp => [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: exp.jobTitle,
                      bold: true,
                      size: 26,
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: exp.companyName,
                      size: 24,
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`,
                      size: 24,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                ...exp.responsibilities.map(resp =>
                  new docx.Paragraph({
                    bullet: { level: 0 },
                    children: [
                      new docx.TextRun({
                        text: resp,
                        size: 24,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
                ),
                new docx.Paragraph({
                  children: [],
                  spacing: { after: 200 },
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
                spacing: { after: 200 },
              }),
              ...resume.education.flatMap(edu => [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: edu.schoolName,
                      bold: true,
                      size: 26,
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: edu.degreeName,
                      size: 24,
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`,
                      size: 24,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 200 },
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
                spacing: { after: 200 },
              }),
              ...(resume.skills.hard_skills.length > 0 ? [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Technical Skills",
                      bold: true,
                      size: 26,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.hard_skills.join(", "),
                      size: 24,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ] : []),
              ...(resume.skills.soft_skills.length > 0 ? [
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: "Soft Skills",
                      bold: true,
                      size: 26,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.soft_skills.join(", "),
                      size: 24,
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

    // Convert to Base64
    const base64String = btoa(String.fromCharCode(...fileBuffer));

    return new Response(
      JSON.stringify({ data: base64String }),
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
