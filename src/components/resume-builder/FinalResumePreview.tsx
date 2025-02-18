
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ResumeData, WorkExperience, Education } from "@/types/resume";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
}

export function FinalResumePreview({
  resumeData: initialResumeData,
  resumeId
}: FinalResumePreviewProps) {
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const selectedTemplate = resumeTemplates[0];

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleUpdateField = async (
    section: keyof ResumeData,
    field: string,
    value: any,
    subsection?: string
  ) => {
    try {
      const newResumeData = { ...resumeData };
      
      if (subsection) {
        newResumeData[section][subsection][field] = value;
      } else {
        newResumeData[section][field] = value;
      }
      
      setResumeData(newResumeData);
      
      const updateData = {
        [section]: newResumeData[section] as unknown as Json
      };
      
      const { error } = await supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId);

      if (error) throw error;

      toast.success("Changes saved", {
        duration: 1000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error("Failed to save changes. Please try again.", {
        duration: 3000,
      });
      setResumeData(prevData => ({ ...prevData }));
    }
  };

  const handleAddExperience = () => {
    const newExperiences = [
      ...resumeData.work_experience,
      {
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
        responsibilities: [""]
      }
    ];
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = resumeData.work_experience.filter((_, i) => i !== index);
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleUpdateExperience = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    const newExperiences = [...resumeData.work_experience];
    if (field === "isCurrentJob") {
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value === "true",
        endDate: value === "true" ? "" : newExperiences[index].endDate
      };
    } else {
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value
      };
    }
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleAddEducation = () => {
    const newEducation = [
      ...resumeData.education,
      {
        degreeName: "",
        schoolName: "",
        startDate: "",
        endDate: "",
        isCurrentlyEnrolled: false
      }
    ];
    handleUpdateField("education", "", newEducation);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    handleUpdateField("education", "", newEducation);
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...resumeData.education];
    if (field === "isCurrentlyEnrolled") {
      newEducation[index] = {
        ...newEducation[index],
        [field]: value === "true",
        endDate: value === "true" ? "" : newEducation[index].endDate
      };
    } else {
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
    }
    handleUpdateField("education", "", newEducation);
  };

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && resumeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        const scaleX = (containerWidth - 48) / A4_WIDTH_PX;
        const scaleY = (containerHeight - 48) / A4_HEIGHT_PX;
        
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

  const renderContent = () => {
    return (
      <div className="max-w-[700px] mx-auto space-y-6">
        <PersonalSection
          fullName={resumeData.personal_info.fullName}
          title={resumeData.professional_summary.title}
          email={resumeData.personal_info.email}
          phone={resumeData.personal_info.phone}
          linkedin={resumeData.personal_info.linkedin}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={(field, value) => handleUpdateField("personal_info", field, value)}
        />

        <div className="mb-4">
          <h3 className="text-base font-bold text-black uppercase tracking-wider mb-3 border-b border-black pb-1">
            Professional Summary
          </h3>
          <div className="text-sm leading-relaxed">
            {isEditing ? (
              <Textarea
                value={resumeData.professional_summary.summary}
                onChange={(e) => handleUpdateField("professional_summary", "summary", e.target.value)}
                placeholder="Write a brief professional summary"
                className="w-full min-h-[80px] max-h-[160px] resize-none"
              />
            ) : (
              resumeData.professional_summary.summary
            )}
          </div>
        </div>

        <ExperienceSection
          experiences={resumeData.work_experience}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={handleUpdateExperience}
          onAdd={handleAddExperience}
          onRemove={handleRemoveExperience}
        />

        <EducationSection
          education={resumeData.education}
          template={selectedTemplate}
          isEditing={isEditing}
          onUpdate={handleUpdateEducation}
          onAdd={handleAddEducation}
          onRemove={handleRemoveEducation}
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
  };

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
      >
        <div 
          ref={resumeRef}
          id="resume-content"
          className={`bg-white shadow-lg mx-auto relative transition-all duration-200 ${
            isEditing ? 'shadow-xl ring-1 ring-primary/10' : ''
          }`}
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          <div 
            ref={contentRef}
            className="w-full h-full p-12 overflow-auto text-black"
            style={{
              fontFamily: 'Georgia, serif'
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
