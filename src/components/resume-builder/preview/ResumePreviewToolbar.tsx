
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
import { A4_DIMENSIONS } from "@/lib/utils";

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
      
      // Target the exact resume element
      const resumeElement = document.querySelector(`[style*="width: ${A4_DIMENSIONS.WIDTH_PX}px"]`);
      
      if (!resumeElement) {
        toast.error("Could not find resume element");
        setIsDownloading(false);
        return;
      }
      
      // Convert the resume to a canvas with improved settings
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        height: resumeElement.scrollHeight,
        windowHeight: resumeElement.scrollHeight
      });
      
      // Create a new PDF document in A4 format
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });
      
      // A4 dimensions - do not change
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm
      
      // Get the image data
      const imgData = canvas.toDataURL("image/png");
      
      // Add the image to the PDF - use full page dimensions
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
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
    <div className="w-full max-w-4xl mx-auto mb-3 md:mb-6 bg-white rounded-lg shadow-md p-2 md:p-3 overflow-x-auto">
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
