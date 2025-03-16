
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Edit, LayoutTemplate, Save } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TemplatePreview } from "../TemplatePreview";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TemplateSelectionGrid } from "./TemplateSelectionGrid";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const handleTemplateChange = (templateId: string) => {
    onTemplateChange(templateId);
    setIsDialogOpen(false);
  };

  const renderTemplateSelector = () => {
    if (isMobile) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-1 bg-white shadow-sm hover:bg-gray-100 px-2 sm:px-3"
              size={isMobile ? "sm" : "default"}
            >
              <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Change</span>
              <span>Template</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-xl overflow-hidden">
            <TemplateSelectionGrid 
              templates={templates}
              currentTemplateId={currentTemplateId}
              onTemplateChange={onTemplateChange}
            />
          </SheetContent>
        </Sheet>
      );
    } else {
      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-100"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Change Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
            <TemplateSelectionGrid 
              templates={templates}
              currentTemplateId={currentTemplateId}
              onTemplateChange={handleTemplateChange}
            />
          </DialogContent>
        </Dialog>
      );
    }
  };

  return (
    <div className="w-full max-w-[21cm] mx-auto mb-4 sm:mb-6 bg-white rounded-lg shadow-md p-2 sm:p-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-primary hover:bg-gray-100 justify-start"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back to Dashboard</span>
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3 justify-end">
          {onToggleEdit && (
            <Button 
              onClick={onToggleEdit} 
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100"
              size={isMobile ? "sm" : "default"}
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          )}
          
          {renderTemplateSelector()}
          
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1 sm:gap-2 bg-primary hover:bg-primary-hover"
            size={isMobile ? "sm" : "default"}
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isDownloading ? "Preparing..." : "Download"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
