
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "@/components/resume-builder/templates";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Function to generate a PDF from the resume data without needing the actual DOM element
export async function generateResumePDF(resumeData: any, resumeId: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '21cm';
      tempContainer.style.height = '29.7cm'; // A4 dimensions
      
      // Apply necessary styles for proper rendering
      tempContainer.style.background = 'white';
      tempContainer.style.overflow = 'hidden';
      tempContainer.className = 'resume-preview-container';
      
      // Get the template
      const template = resumeTemplates.find(t => t.id === resumeData.template_id) || resumeTemplates[0];
      
      // Apply template styles
      if (template.style.spacing && template.style.spacing.margins) {
        tempContainer.style.padding = template.style.spacing.margins.top;
      }
      
      // Create a temporary element to hold the resume content
      const resumeContent = document.createElement('div');
      resumeContent.className = 'w-[21cm] min-h-[29.7cm] bg-white';
      
      // Clone required CSS from the document
      const styleSheets = Array.from(document.styleSheets);
      const styles = document.createElement('style');
      styleSheets.forEach(sheet => {
        try {
          const cssRules = Array.from(sheet.cssRules);
          cssRules.forEach(rule => {
            styles.appendChild(document.createTextNode(rule.cssText));
          });
        } catch (e) {
          console.log('Could not access stylesheet rules');
        }
      });
      
      // Append to document and then to DOM
      document.head.appendChild(styles);
      document.body.appendChild(tempContainer);
      tempContainer.appendChild(resumeContent);
      
      // Create HTML structure for the resume
      resumeContent.innerHTML = `
        <div class="resume-content" style="font-family: ${template.style.bodyFont}; color: ${template.style.colors.text};">
          <div class="header" style="background-color: ${template.style.colors.primary}; color: ${template.style.colors.textOnPrimary}; padding: 20px;">
            <h1 style="font-size: 24px; margin: 0;">${resumeData.personal_info.fullName}</h1>
            <p style="margin: 5px 0 0 0;">${resumeData.professional_summary.title}</p>
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
              ${resumeData.personal_info.email ? `<span>${resumeData.personal_info.email}</span>` : ''}
              ${resumeData.personal_info.phone ? `<span>• ${resumeData.personal_info.phone}</span>` : ''}
              ${resumeData.personal_info.linkedin ? `<span>• ${resumeData.personal_info.linkedin}</span>` : ''}
            </div>
          </div>
          
          <div class="content" style="padding: 20px;">
            ${resumeData.professional_summary.summary ? `
              <div class="section">
                <h2 style="font-size: 18px; color: ${template.style.colors.primary}; border-bottom: 1px solid ${template.style.colors.primary}; padding-bottom: 5px; margin-bottom: 10px;">Professional Summary</h2>
                <p>${resumeData.professional_summary.summary}</p>
              </div>
            ` : ''}
            
            ${resumeData.work_experience && resumeData.work_experience.length > 0 ? `
              <div class="section" style="margin-top: 20px;">
                <h2 style="font-size: 18px; color: ${template.style.colors.primary}; border-bottom: 1px solid ${template.style.colors.primary}; padding-bottom: 5px; margin-bottom: 10px;">Work Experience</h2>
                ${resumeData.work_experience.map(exp => `
                  <div class="experience-item" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between;">
                      <h3 style="font-size: 16px; margin: 0;">${exp.job_title}</h3>
                      <span>${exp.start_date} - ${exp.end_date}</span>
                    </div>
                    <p style="margin: 0;">${exp.company}, ${exp.location}</p>
                    ${Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 ? `
                      <ul style="margin-top: 5px; padding-left: 20px;">
                        ${exp.responsibilities.map(responsibility => `<li>${responsibility}</li>`).join('')}
                      </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section" style="margin-top: 20px;">
                <h2 style="font-size: 18px; color: ${template.style.colors.primary}; border-bottom: 1px solid ${template.style.colors.primary}; padding-bottom: 5px; margin-bottom: 10px;">Education</h2>
                ${resumeData.education.map(edu => `
                  <div class="education-item" style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between;">
                      <h3 style="font-size: 16px; margin: 0;">${edu.degree}</h3>
                      <span>${edu.start_date} - ${edu.end_date}</span>
                    </div>
                    <p style="margin: 0;">${edu.institution}, ${edu.location}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.skills && (resumeData.skills.hard_skills.length > 0 || resumeData.skills.soft_skills.length > 0) ? `
              <div class="section" style="margin-top: 20px;">
                <h2 style="font-size: 18px; color: ${template.style.colors.primary}; border-bottom: 1px solid ${template.style.colors.primary}; padding-bottom: 5px; margin-bottom: 10px;">Skills</h2>
                ${resumeData.skills.hard_skills.length > 0 ? `
                  <div style="margin-bottom: 10px;">
                    <h3 style="font-size: 16px; margin: 5px 0;">Hard Skills</h3>
                    <p>${resumeData.skills.hard_skills.join(', ')}</p>
                  </div>
                ` : ''}
                ${resumeData.skills.soft_skills.length > 0 ? `
                  <div>
                    <h3 style="font-size: 16px; margin: 5px 0;">Soft Skills</h3>
                    <p>${resumeData.skills.soft_skills.join(', ')}</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            ${resumeData.certifications && resumeData.certifications.length > 0 ? `
              <div class="section" style="margin-top: 20px;">
                <h2 style="font-size: 18px; color: ${template.style.colors.primary}; border-bottom: 1px solid ${template.style.colors.primary}; padding-bottom: 5px; margin-bottom: 10px;">Certifications</h2>
                ${resumeData.certifications.map(cert => `
                  <div class="certification-item" style="margin-bottom: 10px;">
                    <p style="margin: 0;"><strong>${cert.name}</strong> - ${cert.issuer} (${cert.date})</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
      
      // Wait for the content to render
      setTimeout(async () => {
        try {
          // Convert the resume to a canvas
          const canvas = await html2canvas(resumeContent, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: "white",
          });
          
          // Create a new PDF document
          const pdf = new jsPDF({
            format: "a4",
            unit: "mm",
            orientation: "portrait",
          });
          
          // A4 dimensions
          const pdfWidth = 210; // mm
          const pdfHeight = 297; // mm
          
          // Calculate image dimensions while preserving aspect ratio
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Add the image to the PDF
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG", 
            0, 
            0, 
            imgWidth, 
            imgHeight
          );
          
          // Save the PDF
          pdf.save(`resume-${resumeId}.pdf`);
          
          // Clean up
          document.body.removeChild(tempContainer);
          
          resolve();
        } catch (error) {
          console.error("Error generating PDF:", error);
          document.body.removeChild(tempContainer);
          reject(error);
        }
      }, 1000); // Give time for fonts to load
    } catch (error) {
      console.error("Error setting up PDF generation:", error);
      reject(error);
    }
  });
}
