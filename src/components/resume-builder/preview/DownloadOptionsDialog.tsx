
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadOptionsDialogProps {
  isDownloading: boolean;
  onDownload: (format: "pdf" | "docx") => void;
}

export function DownloadOptionsDialog({
  isDownloading,
  onDownload
}: DownloadOptionsDialogProps) {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    setOpen(false);
    
    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #resume-content, #resume-content * {
          visibility: visible;
        }
        #resume-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Trigger print
    window.print();

    // Clean up
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);

    toast.success("Print dialog opened. Save as PDF for best results.");
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
            onClick={handlePrint}
            disabled={isDownloading}
          >
            Download as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
