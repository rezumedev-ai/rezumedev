
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DownloadOptionsDialog } from "./preview/DownloadOptionsDialog";
import { supabase } from "@/integrations/supabase/client";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // A4 dimensions (96 DPI)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  const selectedTemplate = resumeTemplates.find(t => t.id === templateId) || resumeTemplates[0];

  const handleDownload = async (format: "pdf" | "docx") => {
    toast.promise(
      async () => {
        const { data, error } = await supabase.functions.invoke('generate-resume', {
          body: { resumeId, format }
        });

        if (error) throw error;

        // Convert the response to a blob and trigger download
        const blob = await data.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return true;
      },
      {
        loading: `Generating ${format.toUpperCase()}...`,
        success: `Resume downloaded successfully as ${format.toUpperCase()}!`,
        error: "Failed to generate file. Please try again."
      }
    );
  };

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
      const { error } = await supabase
        .from("resumes")
        .update({ ...newResumeData })
        .eq("id", resumeId);
        
      if (error) throw error;
      
      toast.success("Changes saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    }
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

  const renderEditableText = (text: string, section: keyof ResumeData, field: string, subsection?: string) => {
    if (!isEditing) return text;

    return (
      <Input
        value={text}
        onChange={(e) => handleUpdateField(section, field, e.target.value, subsection)}
        className="w-full"
      />
    );
  };

  const renderEditableTextArea = (text: string, section: keyof ResumeData, field: string, subsection?: string) => {
    if (!isEditing) return text;

    return (
      <Textarea
        value={text}
        onChange={(e) => handleUpdateField(section, field, e.target.value, subsection)}
        className="w-full min-h-[100px]"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ResumeHeader
        onBack={handleBack}
        onEdit={() => setIsEditing(!isEditing)}
        onDownload={handleDownload}
        onToggleZoom={() => setIsZoomed(prev => !prev)}
        isZoomed={isZoomed}
        isMobile={isMobile}
        isEditing={isEditing}
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
              fullName={renderEditableText(resumeData.personal_info.fullName, "personal_info", "fullName")}
              title={renderEditableText(resumeData.professional_summary.title, "professional_summary", "title")}
              email={renderEditableText(resumeData.personal_info.email, "personal_info", "email")}
              phone={renderEditableText(resumeData.personal_info.phone, "personal_info", "phone")}
              linkedin={resumeData.personal_info.linkedin ? renderEditableText(resumeData.personal_info.linkedin, "personal_info", "linkedin") : undefined}
              template={selectedTemplate}
              isEditing={isEditing}
            />

            <div className={`${selectedTemplate.style.contentStyle} mt-8 space-y-6`}>
              <div>
                <h3 className={selectedTemplate.style.sectionStyle}>
                  Professional Summary
                </h3>
                <div className="text-gray-600 mt-2">
                  {renderEditableTextArea(resumeData.professional_summary.summary, "professional_summary", "summary")}
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
          </div>
        </div>
      </div>
    </div>
  );
}
