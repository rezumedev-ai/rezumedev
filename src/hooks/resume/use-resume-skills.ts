
import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumeSkills(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [skills, setSkills] = useState(initialResumeData.skills);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          skills: data.skills,
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating skills:", error);
        toast.error("Failed to save skills changes");
      }
    } catch (error) {
      console.error("Error in updateSkills:", error);
      toast.error("Failed to save skills changes");
    }
  };

  const handleSkillsUpdate = (type: "hard" | "soft", skills: string[]) => {
    if (!isEditing) return;
    
    setSkills(prev => {
      const skillType = type === "hard" ? "hard_skills" : "soft_skills";
      const updated = {
        ...prev,
        [skillType]: skills
      };
      
      const newState = {
        ...initialResumeData,
        skills: updated
      };
      
      updateResumeData(newState);
      return updated;
    });
  };

  return {
    skills,
    handleSkillsUpdate
  };
}
