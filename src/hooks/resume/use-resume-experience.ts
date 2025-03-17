
import { useState } from "react";
import { ResumeData, WorkExperience } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumeExperience(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [experience, setExperience] = useState(initialResumeData.work_experience);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          work_experience: data.work_experience.map(exp => ({
            ...exp,
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
          })),
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating work experience:", error);
        toast.error("Failed to save experience changes");
      }
    } catch (error) {
      console.error("Error in updateExperience:", error);
      toast.error("Failed to save experience changes");
    }
  };

  const handleExperienceUpdate = (index: number, field: keyof WorkExperience, value: string | string[] | boolean) => {
    if (!isEditing) return;
    
    setExperience(prev => {
      const newExperiences = [...prev];
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: value
      };
      
      const newState = {
        ...initialResumeData,
        work_experience: newExperiences
      };
      
      updateResumeData(newState);
      return newExperiences;
    });
  };

  return {
    experience,
    handleExperienceUpdate
  };
}
