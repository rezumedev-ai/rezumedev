
import { useState, useEffect } from "react";
import { ResumeData, Education, Certification, WorkExperience } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumePreview(initialResumeData: ResumeData, resumeId: string) {
  const [resumeState, setResumeState] = useState<ResumeData>(initialResumeData);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setResumeState(initialResumeData);
  }, [initialResumeData]);
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Resume saved successfully");
    }
  };
  
  // Update resume data in Supabase
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
  
  // Handle template changes
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
  
  return {
    resumeState,
    isEditing,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleTemplateChange
  };
}
