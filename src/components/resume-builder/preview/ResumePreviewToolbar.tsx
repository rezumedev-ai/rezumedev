
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TemplatePreview } from "../TemplatePreview";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  // Handle downloading the resume as PDF
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.info("Preparing your resume for download...");
      
      // Get the resume element - this selector must match exactly what's in FinalResumePreview
      const resumeElement = document.querySelector(".w-\\[21cm\\]");
      
      if (!resumeElement) {
        toast.error("Could not find resume element");
        setIsDownloading(false);
        return;
      }
      
      // Convert the resume to a canvas with improved settings
      // Do not modify these settings as they affect the PDF output quality
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        height: resumeElement.scrollHeight,
        windowHeight: resumeElement.scrollHeight
      });
      
      // Create a new PDF document - do not change format
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });
      
      // A4 dimensions - do not change
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm
      
      // Calculate image dimensions while preserving aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add padding (in mm)
      const topPadding = 0;
      const bottomPadding = 0;
      
      // Calculate the necessary scaling to fit content with padding
      let scaleFactor = 1;
      if (imgHeight > (pdfHeight - topPadding - bottomPadding)) {
        scaleFactor = (pdfHeight - topPadding - bottomPadding) / imgHeight;
      }
      
      // Apply scaling
      const finalImgWidth = imgWidth * scaleFactor;
      const finalImgHeight = imgHeight * scaleFactor;
      
      // Calculate position to center the image horizontally and add top padding
      const xPosition = (pdfWidth - finalImgWidth) / 2;
      const yPosition = topPadding;
      
      // Get the image data
      const imgData = canvas.toDataURL("image/png");
      
      // Add the image to the PDF - don't change these parameters
      pdf.addImage(imgData, "PNG", xPosition, yPosition, finalImgWidth, finalImgHeight);
      
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
    <div className="w-full max-w-[21cm] mx-auto mb-3 md:mb-6 bg-white rounded-lg shadow-md p-2 md:p-3 overflow-x-auto">
      <div className={`flex ${isMobile ? 'flex-col gap-2' : 'justify-between'} items-center`}>
        <Button 
          variant="ghost" 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-primary hover:bg-gray-100 w-full md:w-auto justify-center md:justify-start"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isMobile ? "Back" : "Back to Dashboard"}</span>
        </Button>
        
        <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                size={isMobile ? "sm" : "default"}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isMobile ? "Template" : "Switch Template"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] md:w-[400px] p-3" align={isMobile ? "center" : "end"}>
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
            className={`flex items-center gap-2 bg-primary hover:bg-primary-hover ${isMobile ? 'flex-1' : ''}`}
            size={isMobile ? "sm" : "default"}
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Preparing..." : "Download PDF"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
