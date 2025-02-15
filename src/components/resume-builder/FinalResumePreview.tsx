
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
        
        const scaleX = (containerWidth - 64) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 64) / A4_HEIGHT_PX;
        
        let newScale = Math.min(scaleX, scaleY, 1);
        
        if (isMobile) {
          newScale = isZoomed ? 0.8 : 0.4;
        } else {
          newScale = Math.min(newScale, 0.85);
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
        className="flex-1 overflow-hidden relative flex items-center justify-center p-8"
      >
        <div 
          ref={resumeRef}
          className="bg-white shadow-lg origin-center transition-transform duration-300"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
          }}
        >
          {/* Resume Content */}
          <div className="h-full overflow-hidden">
            <div 
              className="h-full p-12"
              style={{
                fontFamily: selectedTemplate.style.titleFont.split(' ')[0].replace('font-', '')
              }}
            >
              {/* Header */}
              <div className={selectedTemplate.style.headerStyle}>
                <h1 className={selectedTemplate.style.titleFont}>
                  {resumeData.personal_info.fullName}
                </h1>
                <h2 className="text-xl text-gray-600">
                  {resumeData.professional_summary.title}
                </h2>
                <div className="flex gap-4 text-sm text-gray-500 mt-2">
                  <span>{resumeData.personal_info.email}</span>
                  <span>{resumeData.personal_info.phone}</span>
                  {resumeData.personal_info.linkedin && (
                    <span>{resumeData.personal_info.linkedin}</span>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className={selectedTemplate.style.contentStyle}>
                {/* Professional Summary */}
                <div className="mb-6">
                  <h3 className={selectedTemplate.style.sectionStyle}>
                    Professional Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {resumeData.professional_summary.summary}
                  </p>
                </div>

                {/* Work Experience */}
                {resumeData.work_experience.length > 0 && (
                  <div className="mb-6">
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {resumeData.work_experience.map((exp, index) => (
                        <div key={index}>
                          <h4 className="font-medium">{exp.jobTitle}</h4>
                          <div className="text-gray-600">{exp.companyName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                          </div>
                          <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Education
                    </h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
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
                  <div className="mb-6">
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Skills
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {resumeData.skills.hard_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Technical Skills</h4>
                          <div className="text-gray-600">
                            {resumeData.skills.hard_skills.join(", ")}
                          </div>
                        </div>
                      )}
                      {resumeData.skills.soft_skills.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Soft Skills</h4>
                          <div className="text-gray-600">
                            {resumeData.skills.soft_skills.join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className={selectedTemplate.style.sectionStyle}>
                      Certifications
                    </h3>
                    <div className="space-y-4">
                      {resumeData.certifications.map((cert, index) => (
                        <div key={index}>
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
