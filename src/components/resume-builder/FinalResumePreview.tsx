
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
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const isMobile = useIsMobile();
  
  // Get the template
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  useEffect(() => {
    setResumeState(resumeData);
  }, [resumeData]);
  
  // Calculate scale to fit the resume on the screen
  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !resumeRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // A4 dimensions (21cm x 29.7cm at 96 DPI)
      const resumeWidth = 793; // ~21cm at 96 DPI
      const resumeHeight = 1122; // ~29.7cm at 96 DPI
      
      // Leave some margin (5% of container dimensions)
      const availableWidth = containerWidth * 0.95;
      const availableHeight = containerHeight * 0.95;
      
      // Scale based on both width and height constraints
      const scaleX = availableWidth / resumeWidth;
      const scaleY = availableHeight / resumeHeight;
      
      // Use the smaller scale to ensure it fits both dimensions
      const newScale = Math.min(scaleX, scaleY);
      
      setScale(newScale);
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);
  
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
    <div 
      ref={containerRef}
      className="flex flex-col items-center min-h-screen bg-gray-100 py-4 px-3 md:py-8 md:px-0"
      style={{ height: '100vh' }}
    >
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateChange}
        onBackToDashboard={() => navigate("/dashboard")}
      />
      
      <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
        <div 
          ref={resumeRef}
          className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl relative origin-center"
          style={{ 
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            margin: '0 auto',
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
  );
}
