
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadOptionsDialogProps {
  isDownloading: boolean;
  resumeId: string;
}

export function DownloadOptionsDialog({
  isDownloading,
  resumeId
}: DownloadOptionsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDownloadPDF = async () => {
    setOpen(false);
    
    try {
      // Updated selector to match the resume content div - this must be exactly the same as in FinalResumePreview
      const resumeElement = document.querySelector(".w-\\[21cm\\]");
      if (!resumeElement) {
        toast.error("Could not find resume content");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Wait for dialog to close and any transitions to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Convert to canvas with optimal settings - Do not change these settings
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Create PDF - Do not change these settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to maintain aspect ratio - Do not change these calculations
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add image to PDF - Do not change these parameters
      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        'FAST'
      );

      // Save PDF directly
      pdf.save(`resume-${resumeId}.pdf`);
      
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
