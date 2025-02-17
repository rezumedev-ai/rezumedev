import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import * as docx from "https://esm.sh/docx@8.2.3";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generatePDF = async (resume: any) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  let yPos = 40;
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Helper function for text wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  };

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(resume.personal_info.fullName, margin, yPos);
  
  yPos += 25;
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(resume.professional_summary.title, margin, yPos);
  
  yPos += 20;
  doc.setFontSize(10);
  const contactInfo = [
    resume.personal_info.email,
    resume.personal_info.phone,
    resume.personal_info.linkedin
  ].filter(Boolean).join(' • ');
  doc.text(contactInfo, margin, yPos);

  // Professional Summary
  yPos += 30;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Professional Summary", margin, yPos);
  
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  yPos = addWrappedText(
    resume.professional_summary.summary,
    margin,
    yPos,
    pageWidth - (2 * margin),
    15
  );

  // Work Experience
  if (resume.work_experience.length > 0) {
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Work Experience", margin, yPos);

    resume.work_experience.forEach((exp: any) => {
      yPos += 25;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(exp.jobTitle, margin, yPos);

      yPos += 15;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(exp.companyName, margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.text(
        `${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`,
        margin,
        yPos
      );

      yPos += 15;
      doc.setFontSize(10);
      exp.responsibilities.forEach((resp: string) => {
        doc.text("•", margin, yPos);
        yPos = addWrappedText(
          resp,
          margin + 15,
          yPos,
          pageWidth - (2 * margin) - 15,
          15
        );
      });
      yPos += 10;
    });
  }

  // Education
  if (resume.education.length > 0) {
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Education", margin, yPos);

    resume.education.forEach((edu: any) => {
      yPos += 25;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(edu.schoolName, margin, yPos);

      yPos += 15;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(edu.degreeName, margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.text(
        `${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`,
        margin,
        yPos
      );
      yPos += 10;
    });
  }

  // Skills
  if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Skills", margin, yPos);

    if (resume.skills.hard_skills.length > 0) {
      yPos += 25;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Technical Skills", margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos = addWrappedText(
        resume.skills.hard_skills.join(" • "),
        margin,
        yPos,
        pageWidth - (2 * margin),
        15
      );
    }

    if (resume.skills.soft_skills.length > 0) {
      yPos += 20;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Soft Skills", margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos = addWrappedText(
        resume.skills.soft_skills.join(" • "),
        margin,
        yPos,
        pageWidth - (2 * margin),
        15
      );
    }
  }

  return doc.output('arraybuffer');
};

const generateDocx = async (resume: any) => {
  const doc = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Inter",
            size: 24,
            color: "333333",
          },
        },
      },
      paragraphStyles: [
        {
          id: "heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Inter",
            size: 32,
            bold: true,
          },
          paragraph: {
            spacing: {
              after: 240,
            },
          },
        },
        {
          id: "heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Inter",
            size: 28,
            bold: true,
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
      ],
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
              spacing: { after: 400 },
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

  return await docx.Packer.toBuffer(doc);
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
      const arrayBuffer = await generatePDF(resume);
      fileBuffer = new Uint8Array(arrayBuffer);
    } else if (format === 'docx') {
      fileBuffer = await generateDocx(resume);
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
