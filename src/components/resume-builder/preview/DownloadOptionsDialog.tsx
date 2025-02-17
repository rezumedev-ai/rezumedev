
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
    
    // Wait for dialog to close before adding print styles
    setTimeout(() => {
      // Create and add print styles
      const style = document.createElement('style');
      style.id = 'print-styles';
      style.textContent = `
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden;
          }
          body * {
            visibility: hidden;
          }
          #resume-content, #resume-content * {
            visibility: visible;
          }
          #resume-content {
            position: fixed;
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

      // Force browser repaint
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          // Trigger print
          window.print();

          // Remove print styles after printing
          setTimeout(() => {
            const printStyle = document.getElementById('print-styles');
            if (printStyle) {
              document.head.removeChild(printStyle);
            }
          }, 1000);
        });
      });
    }, 100);

    toast.success("Print dialog opened. Select 'Save as PDF' for best results.");
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
