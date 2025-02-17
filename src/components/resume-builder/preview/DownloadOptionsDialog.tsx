
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadOptionsDialogProps {
  isDownloading: boolean;
  onDownload: (format: "pdf" | "docx") => void;
}

export function DownloadOptionsDialog({
  isDownloading,
  onDownload
}: DownloadOptionsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = async () => {
    setOpen(false);
    
    try {
      const resumeElement = document.getElementById('resume-content');
      if (!resumeElement) {
        toast.error("Could not find resume content");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Wait for dialog to close and any transitions to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Reset resume element transform for capture
      const originalTransform = resumeElement.style.transform;
      resumeElement.style.transform = 'none';

      // Capture with optimal settings
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        backgroundColor: "#ffffff",
        width: 794, // A4 width
        height: 1123, // A4 height
        foreignObjectRendering: false,
        removeContainer: false,
      });

      // Restore original transform
      resumeElement.style.transform = originalTransform;

      // Create PDF with correct dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Add the image to PDF with full page coverage
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );

      // Save PDF
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
