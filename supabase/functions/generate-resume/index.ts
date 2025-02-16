
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
      // Initialize PDF with A4 dimensions
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      // Set font to Helvetica (built into jsPDF)
      doc.setFont('helvetica');

      // Left column width (matches preview)
      const leftColumnWidth = 250;
      const pageWidth = 794; // A4 width in points
      const rightColumnWidth = pageWidth - leftColumnWidth - 80; // 80 for margins
      const margin = 40;
      let leftY = margin;
      let rightY = margin;

      // Left Column Content
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55); // text-gray-800
      doc.text('Contact', margin, leftY);
      leftY += 25;

      // Contact details
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99); // text-gray-600
      doc.text(resume.personal_info.phone, margin, leftY);
      leftY += 15;
      doc.text(resume.personal_info.email, margin, leftY);
      leftY += 15;
      if (resume.personal_info.linkedin) {
        doc.text(resume.personal_info.linkedin, margin, leftY);
        leftY += 15;
      }
      leftY += 25;

      // Education Section
      if (resume.education && resume.education.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text('Education', margin, leftY);
        leftY += 25;

        doc.setFontSize(10);
        for (const edu of resume.education) {
          doc.setTextColor(31, 41, 55);
          doc.setFont('helvetica', 'bold');
          doc.text(edu.schoolName, margin, leftY);
          leftY += 15;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          doc.text(edu.degreeName, margin, leftY);
          leftY += 15;

          doc.text(`${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`, margin, leftY);
          leftY += 25;
        }
      }

      // Skills Section
      if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text('Skills', margin, leftY);
        leftY += 25;

        if (resume.skills.hard_skills.length > 0) {
          doc.setFontSize(12);
          doc.text('Technical Skills', margin, leftY);
          leftY += 20;

          doc.setFontSize(10);
          doc.setTextColor(75, 85, 99);
          const hardSkillsText = resume.skills.hard_skills.join(', ');
          const hardSkillsLines = doc.splitTextToSize(hardSkillsText, leftColumnWidth - margin);
          doc.text(hardSkillsLines, margin, leftY);
          leftY += hardSkillsLines.length * 15 + 20;
        }

        if (resume.skills.soft_skills.length > 0) {
          doc.setFontSize(12);
          doc.setTextColor(31, 41, 55);
          doc.text('Soft Skills', margin, leftY);
          leftY += 20;

          doc.setFontSize(10);
          doc.setTextColor(75, 85, 99);
          const softSkillsText = resume.skills.soft_skills.join(', ');
          const softSkillsLines = doc.splitTextToSize(softSkillsText, leftColumnWidth - margin);
          doc.text(softSkillsLines, margin, leftY);
          leftY += softSkillsLines.length * 15 + 20;
        }
      }

      // Right Column Content
      const rightColumnX = margin + leftColumnWidth + 40;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text(resume.personal_info.fullName, rightColumnX, rightY);
      rightY += 30;

      doc.setFontSize(16);
      doc.setTextColor(75, 85, 99);
      doc.setFont('helvetica', 'normal');
      doc.text(resume.professional_summary.title, rightColumnX, rightY);
      rightY += 40;

      // Professional Summary
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text('Profile', rightColumnX, rightY);
      rightY += 20;

      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const summaryLines = doc.splitTextToSize(resume.professional_summary.summary, rightColumnWidth);
      doc.text(summaryLines, rightColumnX, rightY);
      rightY += summaryLines.length * 15 + 30;

      // Work Experience
      if (resume.work_experience && resume.work_experience.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text('Work Experience', rightColumnX, rightY);
        rightY += 25;

        for (const exp of resume.work_experience) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(exp.jobTitle, rightColumnX, rightY);
          rightY += 15;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          doc.text(exp.companyName, rightColumnX, rightY);
          rightY += 15;

          doc.text(`${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, rightColumnX, rightY);
          rightY += 20;

          // Responsibilities
          doc.setTextColor(75, 85, 99);
          for (const resp of exp.responsibilities) {
            const respLines = doc.splitTextToSize(`• ${resp}`, rightColumnWidth);
            doc.text(respLines, rightColumnX, rightY);
            rightY += respLines.length * 15;
          }
          rightY += 20;
        }
      }

      // Convert to Uint8Array
      fileData = new Uint8Array(doc.output('arraybuffer'));
      mimeType = 'application/pdf';
      fileName = `resume-${resumeId}.pdf`;
    } else if (format === 'docx') {
      try {
        const doc = new docx.Document({
          sections: [{
            properties: {},
            children: [
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
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: resume.professional_summary.title,
                    size: 28,
                    color: "666666",
                  }),
                ],
                spacing: { after: 400 },
              }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Contact Information",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { after: 200 },
              }),
              new docx.Paragraph({
                bullet: { level: 0 },
                children: [
                  new docx.TextRun({
                    text: `Phone: ${resume.personal_info.phone}`,
                    size: 20,
                  }),
                ],
              }),
              new docx.Paragraph({
                bullet: { level: 0 },
                children: [
                  new docx.TextRun({
                    text: `Email: ${resume.personal_info.email}`,
                    size: 20,
                  }),
                ],
              }),
              ...(resume.personal_info.linkedin ? [
                new docx.Paragraph({
                  bullet: { level: 0 },
                  children: [
                    new docx.TextRun({
                      text: `LinkedIn: ${resume.personal_info.linkedin}`,
                      size: 20,
                    }),
                  ],
                }),
              ] : []),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "\nProfessional Summary",
                    bold: true,
                    size: 24,
                  }),
                ],
                spacing: { before: 400, after: 200 },
              }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: resume.professional_summary.summary,
                    size: 20,
                  }),
                ],
                spacing: { after: 400 },
              }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Work Experience",
                    bold: true,
                    size: 24,
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
                      size: 22,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: exp.companyName,
                      size: 20,
                      color: "666666",
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`,
                      size: 20,
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
                        size: 20,
                      }),
                    ],
                  })
                ),
                new docx.Paragraph({
                  children: [new docx.TextRun({ text: "" })],
                  spacing: { after: 200 },
                }),
              ]),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Education",
                    bold: true,
                    size: 24,
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
                      size: 22,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: edu.degreeName,
                      size: 20,
                      color: "666666",
                    }),
                  ],
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: `${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`,
                      size: 20,
                      color: "666666",
                    }),
                  ],
                  spacing: { after: 200 },
                }),
              ]),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Skills",
                    bold: true,
                    size: 24,
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
                      size: 22,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.hard_skills.join(", "),
                      size: 20,
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
                      size: 22,
                    }),
                  ],
                  spacing: { after: 100 },
                }),
                new docx.Paragraph({
                  children: [
                    new docx.TextRun({
                      text: resume.skills.soft_skills.join(", "),
                      size: 20,
                    }),
                  ],
                }),
              ] : []),
            ],
          }],
        });

        // Generate DOCX buffer
        fileData = await docx.Packer.toBuffer(doc);
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileName = `resume-${resumeId}.docx`;
      } catch (docxError) {
        console.error('Error generating DOCX:', docxError);
        throw new Error(`Failed to generate DOCX: ${docxError.message}`);
      }
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
