
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
          #resume-content {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 48px !important;
            transform: none !important;
          }
          #resume-content * {
            visibility: visible;
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      document.head.appendChild(style);

      // Force browser repaint and ensure styles are applied
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
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
