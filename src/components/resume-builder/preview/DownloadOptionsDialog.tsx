
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadOptionsDialogProps {
  onDownload: (format: "pdf" | "docx") => Promise<void>;
}

export function DownloadOptionsDialog({ onDownload }: DownloadOptionsDialogProps) {
  const [format, setFormat] = useState<"pdf" | "docx">("pdf");
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async () => {
    try {
      await onDownload(format);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to download resume. Please try again.");
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
          <Button onClick={handleDownload} className="w-full">
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
