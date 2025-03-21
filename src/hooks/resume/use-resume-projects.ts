
import { useState } from "react";
import { ResumeData, Project } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export function useResumeProjects(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [projects, setProjects] = useState(initialResumeData.projects || []);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          projects: data.projects as unknown as Json[],
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating projects:", error);
        toast.error("Failed to save project changes");
      }
    } catch (error) {
      console.error("Error in updateProjects:", error);
      toast.error("Failed to save project changes");
    }
  };

  const handleProjectUpdate = (index: number, field: keyof Project, value: string | string[]) => {
    if (!isEditing) return;
    
    setProjects(prev => {
      const newProjects = [...prev];
      newProjects[index] = {
        ...newProjects[index],
        [field]: value
      };
      
      const newState = {
        ...initialResumeData,
        projects: newProjects
      };
      
      updateResumeData(newState);
      return newProjects;
    });
  };

  return {
    projects,
    handleProjectUpdate
  };
}
