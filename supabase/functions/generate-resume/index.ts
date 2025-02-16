
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

    let fileData: ArrayBuffer;
    let mimeType: string;
    let fileName: string;

    if (format === 'pdf') {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      doc.setFont('helvetica');
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text(resume.personal_info.fullName, 40, 40);
      
      doc.setFontSize(16);
      doc.text(resume.professional_summary.title, 40, 70);
      
      // Contact Info
      doc.setFontSize(12);
      doc.text('Contact Information', 40, 100);
      doc.setFontSize(10);
      doc.text(resume.personal_info.email, 40, 120);
      doc.text(resume.personal_info.phone, 40, 140);
      if (resume.personal_info.linkedin) {
        doc.text(resume.personal_info.linkedin, 40, 160);
      }
      
      // Professional Summary
      let yPos = 200;
      doc.setFontSize(12);
      doc.text('Professional Summary', 40, yPos);
      yPos += 20;
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(resume.professional_summary.summary, 500);
      doc.text(summaryLines, 40, yPos);
      yPos += (summaryLines.length * 15) + 20;

      // Work Experience
      doc.setFontSize(12);
      doc.text('Work Experience', 40, yPos);
      yPos += 20;

      for (const exp of resume.work_experience) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(exp.jobTitle, 40, yPos);
        yPos += 15;
        
        doc.setFont('helvetica', 'normal');
        doc.text(exp.companyName, 40, yPos);
        yPos += 15;
        
        doc.text(`${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, 40, yPos);
        yPos += 20;

        doc.setFontSize(10);
        for (const resp of exp.responsibilities) {
          const respLines = doc.splitTextToSize(`• ${resp}`, 500);
          doc.text(respLines, 40, yPos);
          yPos += respLines.length * 15;
        }
        yPos += 15;
      }

      fileData = doc.output('arraybuffer');
      mimeType = 'application/pdf';
      fileName = `resume-${resumeId}.pdf`;
    } else if (format === 'docx') {
      const doc = new docx.Document({
        sections: [{
          properties: {},
          children: [
            // Header with name and title
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.personal_info.fullName,
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: { after: 200 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: resume.professional_summary.title,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Contact Information
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
              children: [
                new docx.TextRun({
                  text: `Email: ${resume.personal_info.email}`,
                  size: 20,
                }),
              ],
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Phone: ${resume.personal_info.phone}`,
                  size: 20,
                }),
              ],
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `LinkedIn: ${resume.personal_info.linkedin || 'N/A'}`,
                  size: 20,
                }),
              ],
              spacing: { after: 200 },
            }),

            // Professional Summary
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "Professional Summary",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 200 },
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

            // Work Experience
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
                    size: 20,
                  }),
                ],
              }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: exp.companyName,
                    size: 20,
                  }),
                ],
              }),
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: `${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`,
                    size: 20,
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
                children: [],
                spacing: { after: 200 },
              }),
            ]),
          ],
        }],
      });

      fileData = await docx.Packer.toBuffer(doc);
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      fileName = `resume-${resumeId}.docx`;
    } else {
      throw new Error('Unsupported format');
    }

    // Create the response with the binary data
    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': mimeType,
        'Content-Length': fileData.byteLength.toString(),
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

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
