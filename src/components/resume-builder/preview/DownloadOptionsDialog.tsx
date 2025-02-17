
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

      toast.loading("Generating PDF...");

      // Wait for dialog to close and toast to show
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the resume as a canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
      });

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px'
      });

      // Calculate dimensions
      const imgWidth = 794; // A4 width in pixels at 96 DPI
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0),
        'JPEG',
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );

      // Save the PDF
      pdf.save('resume.pdf');
      
      toast.dismiss();
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss();
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
