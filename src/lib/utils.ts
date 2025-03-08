
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ResumeData, ResumeTemplate } from "@/types/resume";
import { resumeTemplates } from "@/components/resume-builder/templates";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Function to generate a PDF from the resume data
export async function generateResumePDF(resumeData: ResumeData): Promise<Blob> {
  // Create a temporary div to render the resume
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '816px'; // A4 width at 96 DPI
  tempDiv.style.height = '1056px'; // A4 height at 96 DPI
  document.body.appendChild(tempDiv);

  // Get the selected template
  const template = resumeTemplates.find(t => t.id === resumeData.template_id) || resumeTemplates[0];

  // Create resume HTML structure
  tempDiv.innerHTML = `
    <div id="resume-for-pdf" style="width: 100%; height: 100%; padding: ${template.style.spacing.margins.top}; background-color: white; font-family: Arial, sans-serif;">
      <div class="header" style="margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0; ${template.style.titleFont || ''}">${resumeData.personal_info.fullName}</h1>
        <h2 style="font-size: 18px; color: #666; margin: 5px 0;">${resumeData.professional_summary.title}</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 14px; color: #666;">
          <span>${resumeData.personal_info.email}</span>
          <span>${resumeData.personal_info.phone}</span>
          ${resumeData.personal_info.linkedin ? `<span>${resumeData.personal_info.linkedin}</span>` : ''}
          ${resumeData.personal_info.website ? `<span>${resumeData.personal_info.website}</span>` : ''}
        </div>
      </div>

      <div class="summary" style="margin-bottom: 20px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; ${template.style.sectionStyle ? `${template.style.sectionStyle.replace('text-', 'color: ').replace('tracking-', 'letter-spacing: ')}` : ''}">Professional Summary</h3>
        <p style="font-size: ${template.style.typography?.bodySize || '14px'}; line-height: ${template.style.typography?.lineHeight || '1.5'}; margin: 0;">
          ${resumeData.professional_summary.summary}
        </p>
      </div>

      ${resumeData.work_experience.length > 0 ? `
        <div class="experience" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; ${template.style.sectionStyle ? `${template.style.sectionStyle.replace('text-', 'color: ').replace('tracking-', 'letter-spacing: ')}` : ''}">Work Experience</h3>
          ${resumeData.work_experience.map(exp => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong style="font-size: 15px;">${exp.jobTitle}</strong>
                <span style="font-size: 14px; color: #666;">${formatDate(exp.startDate)} - ${exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <div style="font-size: 14px; margin-bottom: 5px;">${exp.companyName}</div>
              <ul style="margin: 5px 0 0 20px; padding: 0;">
                ${exp.responsibilities.map(resp => `<li style="font-size: 14px; margin-bottom: 3px;">${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education.length > 0 ? `
        <div class="education" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; ${template.style.sectionStyle ? `${template.style.sectionStyle.replace('text-', 'color: ').replace('tracking-', 'letter-spacing: ')}` : ''}">Education</h3>
          ${resumeData.education.map(edu => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <strong style="font-size: 15px;">${edu.degreeName}</strong>
                <span style="font-size: 14px; color: #666;">${formatDate(edu.startDate)} - ${edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}</span>
              </div>
              <div style="font-size: 14px;">${edu.schoolName}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${(resumeData.skills.hard_skills.length > 0 || resumeData.skills.soft_skills.length > 0) ? `
        <div class="skills" style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; ${template.style.sectionStyle ? `${template.style.sectionStyle.replace('text-', 'color: ').replace('tracking-', 'letter-spacing: ')}` : ''}">Skills</h3>
          ${resumeData.skills.hard_skills.length > 0 ? `
            <div style="margin-bottom: 10px;">
              <h4 style="font-size: 15px; margin-bottom: 5px;">Technical Skills</h4>
              <p style="font-size: 14px; margin: 0;">${resumeData.skills.hard_skills.join(', ')}</p>
            </div>
          ` : ''}
          ${resumeData.skills.soft_skills.length > 0 ? `
            <div>
              <h4 style="font-size: 15px; margin-bottom: 5px;">Soft Skills</h4>
              <p style="font-size: 14px; margin: 0;">${resumeData.skills.soft_skills.join(', ')}</p>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${resumeData.certifications.length > 0 ? `
        <div class="certifications">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px; ${template.style.sectionStyle ? `${template.style.sectionStyle.replace('text-', 'color: ').replace('tracking-', 'letter-spacing: ')}` : ''}">Certifications</h3>
          ${resumeData.certifications.map(cert => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>
                <strong style="font-size: 15px;">${cert.name}</strong>
                <span style="font-size: 14px; margin-left: 5px;">• ${cert.organization}</span>
              </div>
              <span style="font-size: 14px; color: #666;">${formatDate(cert.completionDate)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  try {
    // Use html2canvas to capture the rendered resume
    const canvas = await html2canvas(document.getElementById('resume-for-pdf') as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Generate the PDF as a Blob
    const pdfBlob = pdf.output('blob');
    
    // Clean up the temporary div
    document.body.removeChild(tempDiv);
    
    return pdfBlob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.removeChild(tempDiv);
    throw error;
  }
}
