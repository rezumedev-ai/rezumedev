
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

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
      // Initialize PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Set font
      doc.setFont("helvetica");
      
      // Add content
      const margin = 40;
      let y = margin;
      
      // Header
      doc.setFontSize(24);
      doc.text(resume.personal_info.fullName, margin, y);
      y += 30;
      
      doc.setFontSize(14);
      doc.text(resume.professional_summary.title, margin, y);
      y += 20;
      
      // Contact info
      doc.setFontSize(10);
      doc.text(`${resume.personal_info.email} | ${resume.personal_info.phone}`, margin, y);
      if (resume.personal_info.linkedin) {
        doc.text(` | ${resume.personal_info.linkedin}`, 280, y);
      }
      y += 30;
      
      // Professional Summary
      doc.setFontSize(16);
      doc.text("Professional Summary", margin, y);
      y += 20;
      
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(resume.professional_summary.summary, 530);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 15 + 20;
      
      // Work Experience
      if (resume.work_experience.length > 0) {
        doc.setFontSize(16);
        doc.text("Work Experience", margin, y);
        y += 20;
        
        for (const exp of resume.work_experience) {
          doc.setFontSize(12);
          doc.text(exp.jobTitle, margin, y);
          y += 15;
          
          doc.setFontSize(10);
          doc.text(`${exp.companyName} | ${exp.startDate} - ${exp.isCurrentJob ? 'Present' : exp.endDate}`, margin, y);
          y += 15;
          
          for (const resp of exp.responsibilities) {
            const respLines = doc.splitTextToSize(`• ${resp}`, 530);
            doc.text(respLines, margin, y);
            y += respLines.length * 12;
          }
          y += 15;
        }
      }
      
      // Education
      if (resume.education.length > 0) {
        doc.setFontSize(16);
        doc.text("Education", margin, y);
        y += 20;
        
        for (const edu of resume.education) {
          doc.setFontSize(12);
          doc.text(edu.degreeName, margin, y);
          y += 15;
          
          doc.setFontSize(10);
          doc.text(`${edu.schoolName} | ${edu.startDate} - ${edu.isCurrentlyEnrolled ? 'Present' : edu.endDate}`, margin, y);
          y += 20;
        }
      }
      
      // Skills
      if (resume.skills.hard_skills.length > 0 || resume.skills.soft_skills.length > 0) {
        doc.setFontSize(16);
        doc.text("Skills", margin, y);
        y += 20;
        
        if (resume.skills.hard_skills.length > 0) {
          doc.setFontSize(12);
          doc.text("Technical Skills", margin, y);
          y += 15;
          
          doc.setFontSize(10);
          const hardSkillsText = resume.skills.hard_skills.join(", ");
          const hardSkillsLines = doc.splitTextToSize(hardSkillsText, 530);
          doc.text(hardSkillsLines, margin, y);
          y += hardSkillsLines.length * 12 + 15;
        }
        
        if (resume.skills.soft_skills.length > 0) {
          doc.setFontSize(12);
          doc.text("Soft Skills", margin, y);
          y += 15;
          
          doc.setFontSize(10);
          const softSkillsText = resume.skills.soft_skills.join(", ");
          const softSkillsLines = doc.splitTextToSize(softSkillsText, 530);
          doc.text(softSkillsLines, margin, y);
          y += softSkillsLines.length * 12 + 15;
        }
      }

      // Convert to Uint8Array
      fileData = new Uint8Array(doc.output('arraybuffer'));
      mimeType = 'application/pdf';
      fileName = `resume-${resumeId}.pdf`;
    } else if (format === 'docx') {
      // For now, return an error for DOCX format
      throw new Error('DOCX format is not yet supported');
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
