
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
import { useNavigate } from "react-router-dom";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
  isEditing?: boolean;
}

export function FinalResumePreview({ resumeData, resumeId, isEditing = false }: FinalResumePreviewProps) {
  const [resumeState, setResumeState] = useState<ResumeData>(resumeData);
  const [scale, setScale] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Get the template
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  useEffect(() => {
    setResumeState(resumeData);
  }, [resumeData]);

  useEffect(() => {
    // Determine the appropriate scale based on device size
    const calculateScale = () => {
      if (isMobile) {
        return isZoomed ? 0.85 : 0.5;
      }
      return 1;
    };
    
    setScale(calculateScale());
  }, [isMobile, isZoomed]);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Handle personal info updates
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
  
  // Handle professional summary updates
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
  
  // Handle skills updates
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
  
  // Handle education updates
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
  
  // Handle certification updates
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
  
  // Handle work experience updates
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
  
  // Update the resume data in Supabase
  const updateResumeData = async (data: ResumeData) => {
    try {
      // Convert the data to match Supabase's expected format
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

  // Switch to a different template
  const handleTemplateChange = async (templateId: string) => {
    try {
      setResumeState(prev => {
        const newState = {
          ...prev,
          template_id: templateId
        };
        
        // Update in Supabase
        updateResumeData(newState);
        return newState;
      });
      
      toast.success("Template updated successfully");
    } catch (error) {
      console.error("Error changing template:", error);
      toast.error("Failed to update template");
    }
  };
  
  // Prepare page style based on template
  const pageStyle = {
    padding: template.style.spacing.margins.top,
    fontFamily: template.style.titleFont?.split(' ')[0].replace('font-', '') || 'sans'
  };

  // Calculate dimensions for A4 page (for proper scaling)
  const DPI = 96; // Standard screen DPI
  const WIDTH_INCHES = 8.5;
  const HEIGHT_INCHES = 11;
  const WIDTH_PX = Math.floor(WIDTH_INCHES * DPI); // 816px
  const HEIGHT_PX = Math.floor(HEIGHT_INCHES * DPI); // 1056px
  
  return (
    <div className="flex flex-col items-center bg-gray-100 py-4 min-h-screen overflow-x-hidden">
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateChange}
        onBackToDashboard={() => navigate("/dashboard")}
      />
      
      {isMobile && (
        <div className="py-2 mb-2 w-full flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleZoom}
            className="bg-white shadow-md"
          >
            {isZoomed ? (
              <div className="flex items-center gap-1">
                <ZoomOut className="w-4 h-4" />
                <span className="text-xs">Zoom Out</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <ZoomIn className="w-4 h-4" />
                <span className="text-xs">Zoom In</span>
              </div>
            )}
          </Button>
        </div>
      )}
      
      <div className="w-screen max-w-full flex justify-center items-center px-2 sm:px-4 overflow-hidden">
        <div 
          className="bg-white shadow-xl mx-auto origin-top relative"
          style={{
            width: `${WIDTH_PX}px`,
            height: `${HEIGHT_PX}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            margin: isMobile ? '0 0 200px 0' : '0 auto 40px auto', // Add bottom margin on mobile for scrolling
            minWidth: `${WIDTH_PX}px`,
            maxWidth: `${WIDTH_PX}px`,
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: template.style.spacing.margins.top,
              right: template.style.spacing.margins.right,
              bottom: template.style.spacing.margins.bottom,
              left: template.style.spacing.margins.left,
              overflow: 'hidden',
              boxSizing: 'border-box',
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
