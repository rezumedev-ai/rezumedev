
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadOptionsDialogProps {
  isDownloading: boolean;
}

export function DownloadOptionsDialog({
  isDownloading
}: DownloadOptionsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = async () => {
    setOpen(false);
    
    try {
      // Get the resume element with more precise selector
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        toast.error("Could not find resume content");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Wait for dialog to close and any transitions to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Store original styles to restore later
      const originalStyles = {
        transform: resumeElement.style.transform,
        transition: resumeElement.style.transition,
        width: resumeElement.style.width,
        height: resumeElement.style.height,
      };

      // Create a clone of the resume element to work with
      const clone = resumeElement.cloneNode(true) as HTMLElement;
      
      // Apply necessary styles to the clone for accurate capture
      clone.style.transform = 'none';
      clone.style.transition = 'none';
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = `${resumeElement.offsetWidth}px`;
      clone.style.height = `${resumeElement.offsetHeight}px`;
      
      // Append clone to body for rendering
      document.body.appendChild(clone);

      // Capture with optimal settings for precise rendering
      const canvas = await html2canvas(clone, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Ensure all styles are preserved in the clone
          const clonedElement = clonedDoc.getElementById('resume-content') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.transformOrigin = 'top left';
            // Preserve all computed styles exactly as seen in the preview
            const originalComputedStyle = window.getComputedStyle(resumeElement);
            for (let i = 0; i < originalComputedStyle.length; i++) {
              const prop = originalComputedStyle[i];
              clonedElement.style.setProperty(
                prop,
                originalComputedStyle.getPropertyValue(prop),
                originalComputedStyle.getPropertyPriority(prop)
              );
            }
          }
        }
      });

      // Remove the clone from the DOM
      document.body.removeChild(clone);

      // Restore original styles to the resume element
      Object.assign(resumeElement.style, originalStyles);

      // Create PDF with precise dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // Get PDF dimensions (A4)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Calculate scaling to maintain exact proportions
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      // Determine dimensions that preserve aspect ratio
      let renderWidth, renderHeight;
      if (canvasAspectRatio > pdfAspectRatio) {
        // Canvas is wider than PDF
        renderWidth = pdfWidth;
        renderHeight = pdfWidth / canvasAspectRatio;
      } else {
        // Canvas is taller than PDF
        renderHeight = pdfHeight;
        renderWidth = pdfHeight * canvasAspectRatio;
      }
      
      // Center the image on the page
      const xOffset = (pdfWidth - renderWidth) / 2;
      const yOffset = (pdfHeight - renderHeight) / 2;
      
      // Add image to PDF with precise positioning
      pdf.addImage(
        imgData,
        'JPEG',
        xOffset,
        yOffset,
        renderWidth,
        renderHeight,
        undefined,
        'FAST'
      );

      // Save PDF directly
      pdf.save('resume.pdf');
      
      // Clear loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
        disabled={isDownloading}
      >
        <FileDown className="w-4 h-4 mr-2" />
        Download
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Button 
            className="w-full" 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            Download as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
