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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { cn } from "@/utils/cn";

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
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialResumeData.template_id || "executive-clean");
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const CONTENT_MARGIN = 48;

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
      
      await supabase
        .from("resumes")
        .update(updateData)
        .eq("id", resumeId);
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
      setResumeData(prevData => ({ ...prevData }));
    }
  };

  const handleAddExperience = () => {
    const newExperiences = [...resumeData.work_experience, {
      jobTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      responsibilities: [""]
    }];
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = resumeData.work_experience.filter((_, i) => i !== index);
    handleUpdateField("work_experience", "", newExperiences);
  };

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    try {
      await supabase
        .from("resumes")
        .update({ template_id: templateId })
        .eq("id", resumeId);
      
      toast.success("Template updated successfully");
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error("Failed to update template");
    }
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

  const selectedTemplate = resumeTemplates.find(t => t.id === selectedTemplateId) || resumeTemplates[0];

  const renderContent = () => {
    return (
      <div className="max-w-[700px] mx-auto">
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
                className="w-full h-24 resize-none"
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
          onUpdate={(index, field, value) => {
            const newExperiences = [...resumeData.work_experience];
            newExperiences[index] = { ...newExperiences[index], [field]: value };
            handleUpdateField("work_experience", "", newExperiences);
          }}
          onAdd={handleAddExperience}
          onRemove={handleRemoveExperience}
        />

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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResumeHeader
        onBack={handleBack}
        onEdit={() => setIsEditing(!isEditing)}
        isEditing={isEditing}
        isDownloading={isDownloading}
        onTemplateChange={handleTemplateChange}
        selectedTemplate={selectedTemplateId}
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
          className={cn(
            "bg-white shadow-lg mx-auto relative transition-all duration-200",
            selectedTemplate.style.contentStyle
          )}
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          <div 
            ref={contentRef}
            className={cn(
              "w-full h-full",
              `p-${selectedTemplate.style.spacing.contentPadding}`
            )}
            style={{
              fontFamily: selectedTemplate.style.layout === "modern" ? 
                'Inter, sans-serif' : 
                selectedTemplate.style.layout === "minimal" ?
                'Helvetica, Arial, sans-serif' :
                'Georgia, serif'
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
