
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WorkExperience, ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { formatDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Download, ArrowLeft, ZoomIn, ZoomOut, Edit } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  onEdit?: () => void;
  resumeId: string;
}

export function FinalResumePreview({
  resumeData,
  templateId,
  onEdit,
  resumeId
}: FinalResumePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // A4 dimensions (96 DPI)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN = 48;

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

  const toggleZoom = () => {
    setIsZoomed(prev => !prev);
  };

  const handleDownload = async () => {
    toast.promise(
      async () => {
        // Placeholder for PDF generation - will be implemented later
        await new Promise(resolve => setTimeout(resolve, 1500));
        return true;
      },
      {
        loading: "Generating PDF...",
        success: "Resume downloaded successfully!",
        error: "Failed to generate PDF. Please try again."
      }
    );
  };

  const handleBack = () => {
    navigate(`/resume-builder/${resumeId}`);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate the available space accounting for padding
        const availableWidth = containerWidth - 32; // 16px padding on each side
        const availableHeight = containerHeight - 32;
        
        // Calculate scale based on available space
        const scaleX = availableWidth / A4_WIDTH_PX;
        const scaleY = availableHeight / A4_HEIGHT_PX;
        
        let newScale;
        if (isMobile) {
          // On mobile, prioritize width scaling for better readability
          newScale = isZoomed ? Math.min(scaleX, scaleY, 0.8) : Math.min(scaleX, 0.45);
        } else {
          // On desktop, maintain aspect ratio
          newScale = Math.min(scaleX, scaleY, 0.85);
        }
        
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Resume Preview</h1>
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleZoom}
                className="shrink-0"
              >
                {isZoomed ? (
                  <ZoomOut className="h-4 w-4" />
                ) : (
                  <ZoomIn className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-center justify-center p-4 md:p-8"
      >
        <div 
          ref={resumeRef}
          className="bg-white shadow-lg origin-center transition-transform duration-300 w-full"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Resume Content */}
          <div className="h-full overflow-hidden">
            <div 
              className="h-full p-8 md:p-12 overflow-y-auto"
              style={{
                fontFamily: selectedTemplate.style.titleFont.split(' ')[0].replace('font-', '')
              }}
            >
              {/* Header */}
              <div className={`${selectedTemplate.style.headerStyle} break-words`}>
                <h1 className={`${selectedTemplate.style.titleFont} text-2xl md:text-3xl`}>
                  {resumeData.personal_info.fullName}
                </h1>
                <h2 className="text-lg md:text-xl text-gray-600">
                  {resumeData.professional_summary.title}
                </h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500 mt-2">
                  <span className="break-words">{resumeData.personal_info.email}</span>
                  <span className="break-words">{resumeData.personal_info.phone}</span>
                  {resumeData.personal_info.linkedin && (
                    <span className="break-words">{resumeData.personal_info.linkedin}</span>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className={`${selectedTemplate.style.contentStyle} space-y-6`}>
                {/* Professional Summary */}
                <div>
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    Professional Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed break-words">
                    {resumeData.professional_summary.summary}
                  </p>
                </div>

                {/* Work Experience */}
                {resumeData.work_experience.length > 0 && (
                  <div>
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {resumeData.work_experience.map((exp, index) => (
                        <div key={index} className="break-words">
                          <h4 className="font-medium">{exp.jobTitle}</h4>
                          <div className="text-gray-600">{exp.companyName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                          </div>
                          <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className="break-words">{resp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div>
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Education
                    </h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="break-words">
                          <h4 className="font-medium">{edu.degreeName}</h4>
                          <div className="text-gray-600">{edu.schoolName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {(resumeData.skills.hard_skills.length > 0 || resumeData.skills.soft_skills.length > 0) && (
                  <div>
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {resumeData.skills.hard_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Technical Skills</h4>
                          <div className="text-gray-600 break-words">
                            {resumeData.skills.hard_skills.join(", ")}
                          </div>
                        </div>
                      )}
                      {resumeData.skills.soft_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Soft Skills</h4>
                          <div className="text-gray-600 break-words">
                            {resumeData.skills.soft_skills.join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <div>
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Certifications
                    </h3>
                    <div className="space-y-4">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={index} className="break-words">
                          <h4 className="font-medium">{cert.name}</h4>
                          <div className="text-gray-600">{cert.organization}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(cert.completionDate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
