
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadOptionsDialogProps {
  resumeId: string;
}

export function DownloadOptionsDialog({ resumeId }: DownloadOptionsDialogProps) {
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      
      if (format === "pdf") {
        // Get the resume content element
        const element = document.querySelector(".resume-content");
        if (!element) {
          throw new Error("Resume content not found");
        }

        // Configure pdf options
        const opt = {
          margin: [0, 0],
          filename: 'resume.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            letterRendering: true
          },
          jsPDF: { 
            unit: 'pt', 
            format: 'a4', 
            orientation: 'portrait'
          }
        };

        // Generate PDF using html2pdf
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(element).save();
        toast.success("Resume downloaded successfully");
      } else {
        toast.error("DOCX format is not yet supported");
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as "pdf" | "docx")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf">PDF Format</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="docx" id="docx" />
              <Label htmlFor="docx">Word Document (DOCX)</Label>
            </div>
          </RadioGroup>
          <Button 
            onClick={handleDownload} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
