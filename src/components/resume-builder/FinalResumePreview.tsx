
import { useState, useEffect, useRef } from "react";
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
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { A4_DIMENSIONS, calculateResumeScale } from "@/lib/utils";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
  isEditing?: boolean;
}

export function FinalResumePreview({ resumeData, resumeId, isEditing = false }: FinalResumePreviewProps) {
  const [resumeState, setResumeState] = useState<ResumeData>(resumeData);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(isMobile ? 0.35 : 0.85);
  
  // Get the template
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  useEffect(() => {
    setResumeState(resumeData);
  }, [resumeData]);

  // Calculate scale based on container width
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const newScale = calculateResumeScale(containerWidth, isMobile);
      setScale(newScale);
    };
    
    // Calculate initial scale
    calculateScale();
    
    // Set up event listener for window resize
    window.addEventListener('resize', calculateScale);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', calculateScale);
  }, [isMobile]);
  
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
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-4 md:py-8">
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateChange}
        onBackToDashboard={() => navigate("/dashboard")}
      />
      
      <div ref={containerRef} className="w-full overflow-hidden pb-12">
        <div className="flex justify-center">
          {/* A4 resume container with dynamic scaling */}
          <div 
            className="bg-white shadow-xl mx-auto mb-10 relative origin-top transition-transform duration-200"
            style={{
              width: `${A4_DIMENSIONS.WIDTH_PX}px`,
              height: `${A4_DIMENSIONS.HEIGHT_PX}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              marginBottom: isMobile ? `${A4_DIMENSIONS.HEIGHT_PX * scale * 0.1}px` : '40px'
            }}
          >
            <div style={pageStyle}>
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
    </div>
  );
}
