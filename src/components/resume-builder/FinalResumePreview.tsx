
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
import { DownloadOptionsDialog } from "./preview/DownloadOptionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  onEdit?: () => void;
  resumeId: string;
}

export function FinalResumePreview({
  resumeData: initialResumeData,
  templateId,
  resumeId
}: FinalResumePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [isDownloading, setIsDownloading] = useState(false);
  const [needsSecondPage, setNeedsSecondPage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const CONTENT_MARGIN = 48;
  const CONTENT_MAX_HEIGHT = A4_HEIGHT_PX - (CONTENT_MARGIN * 2);

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleUpdateField = async (
    section: keyof ResumeData,
    field: string,
    value: any,
    subsection?: string
  ) => {
    const newResumeData = { ...resumeData };
    
    if (subsection) {
      newResumeData[section][subsection][field] = value;
    } else {
      newResumeData[section][field] = value;
    }
    
    setResumeData(newResumeData);
    
    try {
      const updateData = {
        [section]: newResumeData[section] as unknown as Json
      };
      
      const { error } = await supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId);
        
      if (error) throw error;
      
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const renderEditableField = (component: JSX.Element): JSX.Element | string => {
    return isEditing ? component : component.props.value;
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

  useEffect(() => {
    const checkContentOverflow = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsSecondPage(contentHeight > CONTENT_MAX_HEIGHT);
      }
    };

    checkContentOverflow();
  }, [resumeData]);

  const renderContent = (isSecondPage: boolean = false) => {
    if (isSecondPage) {
      return (
        <div className={selectedTemplate.style.contentStyle}>
          <EducationSection
            education={resumeData.education}
            template={selectedTemplate}
            isEditing={isEditing}
            onUpdate={(index, field, value) => {
              const newEducation = [...resumeData.education];
              newEducation[index] = { ...newEducation[index], [field]: value };
              handleUpdateField("education", "", newEducation);
            }}
          />
          <SkillsSection
            hardSkills={resumeData.skills.hard_skills}
            softSkills={resumeData.skills.soft_skills}
            template={selectedTemplate}
            isEditing={isEditing}
            onUpdate={(type, skills) => {
              handleUpdateField("skills", type === "hard" ? "hard_skills" : "soft_skills", skills);
            }}
          />
          <CertificationsSection
            certifications={resumeData.certifications}
            template={selectedTemplate}
            isEditing={isEditing}
            onUpdate={(index, field, value) => {
              const newCertifications = [...resumeData.certifications];
              newCertifications[index] = { ...newCertifications[index], [field]: value };
              handleUpdateField("certifications", "", newCertifications);
            }}
          />
        </div>
      );
    }

    return (
      <>
        <PersonalSection
          fullName={resumeData.personal_info.fullName}
          title={resumeData.professional_summary.title}
          email={resumeData.personal_info.email}
          phone={resumeData.personal_info.phone}
          linkedin={resumeData.personal_info.linkedin}
          template={selectedTemplate}
        />

        <div className={`${selectedTemplate.style.contentStyle} mt-6`}>
          <div className="mb-4">
            <h3 className={selectedTemplate.style.sectionStyle}>
              Professional Summary
            </h3>
            <div className="text-gray-600 mt-2">
              {resumeData.professional_summary.summary}
            </div>
          </div>

          <ExperienceSection
            experiences={resumeData.work_experience}
            template={selectedTemplate}
            isEditing={isEditing}
            onUpdate={(index, field, value) => {
              const newExperiences = [...resumeData.work_experience];
              newExperiences[index] = { ...newExperiences[index], [field]: value };
              handleUpdateField("work_experience", "", newExperiences);
            }}
          />

          {!needsSecondPage && (
            <>
              <EducationSection
                education={resumeData.education}
                template={selectedTemplate}
                isEditing={isEditing}
                onUpdate={(index, field, value) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...newEducation[index], [field]: value };
                  handleUpdateField("education", "", newEducation);
                }}
              />
              <SkillsSection
                hardSkills={resumeData.skills.hard_skills}
                softSkills={resumeData.skills.soft_skills}
                template={selectedTemplate}
                isEditing={isEditing}
                onUpdate={(type, skills) => {
                  handleUpdateField("skills", type === "hard" ? "hard_skills" : "soft_skills", skills);
                }}
              />
              <CertificationsSection
                certifications={resumeData.certifications}
                template={selectedTemplate}
                isEditing={isEditing}
                onUpdate={(index, field, value) => {
                  const newCertifications = [...resumeData.certifications];
                  newCertifications[index] = { ...newCertifications[index], [field]: value };
                  handleUpdateField("certifications", "", newCertifications);
                }}
              />
            </>
          )}
        </div>
      </>
    );
  };

  const renderPage = (pageNumber: number) => (
    <div 
      key={pageNumber}
      ref={pageNumber === 1 ? resumeRef : undefined}
      id={pageNumber === 1 ? "resume-content" : `resume-page-${pageNumber}`}
      className="bg-white shadow-lg mx-auto"
      style={{
        width: `${A4_WIDTH_PX}px`,
        height: `${A4_HEIGHT_PX}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        position: 'absolute',
        top: `${(pageNumber - 1) * (A4_HEIGHT_PX * scale + 40)}px`,
      }}
    >
      <div 
        ref={pageNumber === 1 ? contentRef : undefined}
        className="w-full h-full p-[48px]"
        style={{
          fontFamily: selectedTemplate.style.titleFont.split(' ')[0].replace('font-', '')
        }}
      >
        {renderContent(pageNumber === 2)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResumeHeader
        onBack={handleBack}
        onEdit={() => setIsEditing(!isEditing)}
        isEditing={isEditing}
        isDownloading={isDownloading}
      >
        <DownloadOptionsDialog isDownloading={isDownloading} />
      </ResumeHeader>

      <div 
        ref={containerRef}
        className="flex-1 relative flex items-start justify-center p-4 md:p-8 bg-gray-100 overflow-auto"
        style={{
          minHeight: needsSecondPage ? `${2 * (A4_HEIGHT_PX * scale + 40)}px` : `${A4_HEIGHT_PX * scale + 40}px`
        }}
      >
        {renderPage(1)}
        {needsSecondPage && renderPage(2)}
      </div>
    </div>
  );
}
