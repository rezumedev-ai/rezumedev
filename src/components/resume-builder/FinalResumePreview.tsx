
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ResumeHeader } from "./preview/ResumeHeader";
import { PersonalSection } from "./preview/PersonalSection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { EducationSection } from "./preview/EducationSection";
import { SkillsSection } from "./preview/SkillsSection";
import { CertificationsSection } from "./preview/CertificationsSection";

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

  // A4 dimensions (96 DPI)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

  const handleDownload = async () => {
    toast.promise(
      async () => {
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
        
        const scaleX = (containerWidth - 40) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 40) / A4_HEIGHT_PX;
        
        const newScale = isMobile 
          ? isZoomed ? Math.min(scaleX, scaleY, 0.8) : Math.min(scaleX, 0.4)
          : Math.min(scaleX, scaleY, 0.85);
        
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile, isZoomed]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResumeHeader
        onBack={handleBack}
        onEdit={onEdit || (() => {})}
        onDownload={handleDownload}
        onToggleZoom={() => setIsZoomed(prev => !prev)}
        isZoomed={isZoomed}
        isMobile={isMobile}
      />

      <div 
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center p-4 md:p-8 bg-gray-100"
      >
        <div 
          ref={resumeRef}
          className="bg-white shadow-lg"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            position: 'absolute',
          }}
        >
          <div 
            className="w-full h-full p-[48px]"
            style={{
              fontFamily: selectedTemplate.style.titleFont.split(' ')[0].replace('font-', '')
            }}
          >
            <PersonalSection
              fullName={resumeData.personal_info.fullName}
              title={resumeData.professional_summary.title}
              email={resumeData.personal_info.email}
              phone={resumeData.personal_info.phone}
              linkedin={resumeData.personal_info.linkedin}
              template={selectedTemplate}
            />

            <div className={`${selectedTemplate.style.contentStyle} mt-8 space-y-6`}>
              <div>
                <h3 className={selectedTemplate.style.sectionStyle}>
                  Professional Summary
                </h3>
                <p className="text-gray-600 mt-2">
                  {resumeData.professional_summary.summary}
                </p>
              </div>

              <ExperienceSection
                experiences={resumeData.work_experience}
                template={selectedTemplate}
              />

              <EducationSection
                education={resumeData.education}
                template={selectedTemplate}
              />

              <SkillsSection
                hardSkills={resumeData.skills.hard_skills}
                softSkills={resumeData.skills.soft_skills}
                template={selectedTemplate}
              />

              <CertificationsSection
                certifications={resumeData.certifications}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
