
import { useState, useEffect } from "react";
import { ResumeData, Education, Certification, WorkExperience } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PersonalSection } from "./preview/PersonalSection";
import { ProfessionalSummarySection } from "./preview/ProfessionalSummarySection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { EducationSection } from "./preview/EducationSection";
import { SkillsSection } from "./preview/SkillsSection";
import { CertificationsSection } from "./preview/CertificationsSection";
import { resumeTemplates } from "./templates";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
  isEditing?: boolean;
}

export function FinalResumePreview({ resumeData, resumeId, isEditing = false }: FinalResumePreviewProps) {
  const [resumeState, setResumeState] = useState<ResumeData>(resumeData);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  useEffect(() => {
    setResumeState(resumeData);
  }, [resumeData]);
  
  useEffect(() => {
    const calculateScale = () => {
      const pageWidth = 8.5 * 96;
      const viewportWidth = window.innerWidth;
      
      // Calculate the available width for the resume
      const availableWidth = Math.min(viewportWidth - 32, 800); // Subtract padding and set a max width
      
      let newScale = 1;
      
      if (availableWidth < pageWidth) {
        newScale = availableWidth / pageWidth;
      }
      
      setScale(newScale);
      setContainerWidth(viewportWidth);
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, []);
  
  const handlePersonalInfoUpdate = (field: string, value: string) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const newState = {
        ...prev,
        personal_info: {
          ...prev.personal_info,
          [field]: value
        }
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const handleSummaryUpdate = (summary: string) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const newState = {
        ...prev,
        professional_summary: {
          ...prev.professional_summary,
          summary
        }
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const handleSkillsUpdate = (type: "hard" | "soft", skills: string[]) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const skillType = type === "hard" ? "hard_skills" : "soft_skills";
      const newState = {
        ...prev,
        skills: {
          ...prev.skills,
          [skillType]: skills
        }
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const handleEducationUpdate = (index: number, field: keyof Education, value: string) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
      
      const newState = {
        ...prev,
        education: newEducation
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const handleCertificationUpdate = (index: number, field: keyof Certification, value: string) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = {
        ...newCertifications[index],
        [field]: value
      };
      
      const newState = {
        ...prev,
        certifications: newCertifications
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const handleExperienceUpdate = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    if (!isEditing) return;
    
    setResumeState(prev => {
      const newExperiences = [...prev.work_experience];
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value
      };
      
      const newState = {
        ...prev,
        work_experience: newExperiences
      };
      
      updateResumeData(newState);
      return newState;
    });
  };
  
  const updateResumeData = async (data: ResumeData) => {
    try {
      const supabaseData = {
        personal_info: data.personal_info,
        professional_summary: data.professional_summary,
        work_experience: data.work_experience.map(exp => ({
          ...exp,
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
        })),
        education: data.education.map(edu => ({
          ...edu
        })),
        skills: data.skills,
        certifications: data.certifications.map(cert => ({
          ...cert
        })),
        template_id: data.template_id
      };
      
      const { error } = await supabase
        .from('resumes')
        .update(supabaseData)
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating resume:", error);
        toast.error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error in updateResumeData:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleTemplateChange = async (templateId: string) => {
    try {
      setResumeState(prev => {
        const newState = {
          ...prev,
          template_id: templateId
        };
        
        updateResumeData(newState);
        return newState;
      });
      
      toast.success("Template updated successfully");
    } catch (error) {
      console.error("Error changing template:", error);
      toast.error("Failed to update template");
    }
  };
  
  const pageStyle = {
    padding: template.style.spacing.margins.top,
    fontFamily: template.style.typography?.fontFamily || 'sans-serif'
  };
  
  const pageWidth = 8.5 * 96;
  const pageHeight = 11 * 96;
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateChange}
        onBackToDashboard={() => navigate("/dashboard")}
      />
      
      <div className="w-full max-w-full px-4 pb-8 flex justify-center">
        <div className="relative" style={{ 
          width: `${pageWidth * scale}px`, 
          height: `${pageHeight * scale}px`
        }}>
          <div 
            className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl absolute top-0 left-0 origin-top-left"
            style={{ 
              transform: `scale(${scale})`,
              width: `${pageWidth}px`,
              height: `${pageHeight}px`,
              ...pageStyle
            }}
          >
            <PersonalSection 
              fullName={resumeState.personal_info.fullName}
              title={resumeState.professional_summary.title}
              email={resumeState.personal_info.email}
              phone={resumeState.personal_info.phone}
              linkedin={resumeState.personal_info.linkedin}
              website={resumeState.personal_info.website}
              template={template}
              isEditing={isEditing}
              onUpdate={handlePersonalInfoUpdate}
            />
            
            <ProfessionalSummarySection 
              summary={resumeState.professional_summary.summary} 
              template={template}
              isEditing={isEditing}
              onUpdate={handleSummaryUpdate}
            />
            
            <ExperienceSection 
              experiences={resumeState.work_experience} 
              template={template}
              isEditing={isEditing}
              onUpdate={handleExperienceUpdate}
            />
            
            <EducationSection 
              education={resumeState.education} 
              template={template}
              isEditing={isEditing}
              onUpdate={handleEducationUpdate}
            />
            
            <SkillsSection 
              hardSkills={resumeState.skills.hard_skills} 
              softSkills={resumeState.skills.soft_skills} 
              template={template}
              isEditing={isEditing}
              onUpdate={handleSkillsUpdate}
            />
            
            <CertificationsSection 
              certifications={resumeState.certifications} 
              template={template}
              isEditing={isEditing}
              onUpdate={handleCertificationUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
