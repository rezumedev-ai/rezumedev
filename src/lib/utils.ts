
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { resumeTemplates } from "@/components/resume-builder/templates";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Function to generate a PDF version of the resume
export async function generateResumePDF(resumeData: any, resumeId: string): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a temporary container to render the resume
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      document.body.appendChild(container);
      
      // Create resume content div
      const contentDiv = document.createElement('div');
      contentDiv.id = 'pdf-resume-content';
      contentDiv.style.width = '8.5in';
      contentDiv.style.height = '11in';
      contentDiv.style.backgroundColor = 'white';
      contentDiv.style.position = 'relative';
      contentDiv.style.overflow = 'hidden';
      container.appendChild(contentDiv);
      
      // Get the template
      const template = resumeTemplates.find(t => t.id === resumeData.template_id) || resumeTemplates[0];
      
      // Apply template styles to content div
      const margins = template.style.spacing.margins;
      
      // Create content container with margins
      const inner = document.createElement('div');
      inner.style.position = 'absolute';
      inner.style.top = margins.top;
      inner.style.right = margins.right;
      inner.style.bottom = margins.bottom;
      inner.style.left = margins.left;
      inner.style.fontFamily = template.style.typography.fontFamily || 'Arial, sans-serif';
      inner.style.color = template.style.colors.text;
      contentDiv.appendChild(inner);
      
      // Create header
      const header = document.createElement('div');
      header.style.marginBottom = '1.5rem';
      inner.appendChild(header);
      
      // Add name
      const name = document.createElement('h1');
      name.textContent = resumeData.personal_info.fullName;
      name.style.fontSize = '24px';
      name.style.fontWeight = 'bold';
      name.style.margin = '0 0 8px 0';
      name.style.fontFamily = template.style.typography.fontFamily || 'Arial, sans-serif';
      header.appendChild(name);
      
      // Add job title
      const title = document.createElement('h2');
      title.textContent = resumeData.professional_summary.title;
      title.style.fontSize = '18px';
      title.style.margin = '0 0 8px 0';
      title.style.fontWeight = 'normal';
      title.style.color = template.style.colors.secondary;
      header.appendChild(title);
      
      // Add contact info
      const contact = document.createElement('div');
      contact.style.display = 'flex';
      contact.style.flexWrap = 'wrap';
      contact.style.gap = '12px';
      contact.style.fontSize = '14px';
      contact.style.color = template.style.colors.text;
      
      const email = document.createElement('span');
      email.textContent = resumeData.personal_info.email;
      contact.appendChild(email);
      
      const phone = document.createElement('span');
      phone.textContent = resumeData.personal_info.phone;
      contact.appendChild(phone);
      
      if (resumeData.personal_info.linkedin) {
        const linkedin = document.createElement('span');
        linkedin.textContent = resumeData.personal_info.linkedin;
        contact.appendChild(linkedin);
      }
      
      header.appendChild(contact);
      
      // Render to PDF
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(contentDiv, {
            scale: 2,
            useCORS: true,
            logging: false
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'in',
            format: [8.5, 11]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11);
          
          // Clean up
          document.body.removeChild(container);
          
          const blob = pdf.output('blob');
          resolve(blob);
        } catch (error) {
          console.error('Error generating PDF:', error);
          document.body.removeChild(container);
          reject(error);
        }
      }, 100);
    } catch (error) {
      console.error('Error setting up PDF generation:', error);
      reject(error);
    }
  });
}
