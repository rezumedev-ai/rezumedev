
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, RefreshCw, Save } from "lucide-react";
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
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export function ResumePreviewToolbar({
  currentTemplateId,
  templates,
  resumeId,
  onTemplateChange,
  onBackToDashboard,
  isEditing = false,
  onToggleEdit,
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
      
      // Convert the resume to a canvas with improved settings
      const canvas = await html2canvas(resumeElement as HTMLElement, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
        height: resumeElement.scrollHeight,
        windowHeight: resumeElement.scrollHeight
      });
      
      // Create a new PDF document
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });
      
      // A4 dimensions
      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm
      
      // Calculate image dimensions while preserving aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add padding (in mm)
      const topPadding = 15;
      const bottomPadding = 15;
      
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
      
      // Add the image to the PDF
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
          {onToggleEdit && (
            <Button 
              onClick={onToggleEdit} 
              variant="outline"
              className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-100"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          )}
          
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
