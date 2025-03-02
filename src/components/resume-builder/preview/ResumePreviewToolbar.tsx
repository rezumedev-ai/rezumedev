
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TemplatePreview } from "../TemplatePreview";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumePreviewToolbarProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  resumeId: string;
  onTemplateChange: (templateId: string) => void;
  onBackToDashboard: () => void;
}

export function ResumePreviewToolbar({
  currentTemplateId,
  templates,
  resumeId,
  onTemplateChange,
  onBackToDashboard,
}: ResumePreviewToolbarProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle downloading the resume as PDF
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info("Preparing your resume for download...");
      
      // Get the resume element
      const resumeElement = document.querySelector(".w-\\[21cm\\]");
      
      if (!resumeElement) {
        toast.error("Could not find resume element");
        setIsDownloading(false);
        return;
      }
      
      // Convert the resume to a canvas
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        // Capture the full content without cutting off
        height: resumeElement.scrollHeight,
        windowHeight: resumeElement.scrollHeight
      });
      
      // Create a new PDF document
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });
      
      // Add the canvas to the PDF with proper margins
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate height based on aspect ratio but leave some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculate top margin to center content vertically if needed
      const verticalMargin = Math.max(0, (pageHeight - imgHeight) / 2);
      const topMargin = Math.min(10, verticalMargin); // Max 10mm top margin
      
      // Add the image to fit properly on the page
      pdf.addImage(imgData, "PNG", 0, topMargin, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`resume-${resumeId}.pdf`);
      
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-[21cm] mx-auto mb-6 bg-white rounded-lg shadow-md p-3">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-primary hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Switch Template</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-3" align="end">
              <h3 className="text-lg font-semibold mb-3">Choose a Template</h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <TemplatePreview
                    key={template.id}
                    template={template}
                    isSelected={template.id === currentTemplateId}
                    onSelect={() => onTemplateChange(template.id)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Preparing..." : "Download PDF"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
