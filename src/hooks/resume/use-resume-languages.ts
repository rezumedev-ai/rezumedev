
import { useState } from "react";
import { ResumeData, Language } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export function useResumeLanguages(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [languages, setLanguages] = useState(initialResumeData.languages || []);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          languages: data.languages as unknown as Json[],
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating languages:", error);
        toast.error("Failed to save language changes");
      }
    } catch (error) {
      console.error("Error in updateLanguages:", error);
      toast.error("Failed to save language changes");
    }
  };

  const handleLanguageUpdate = (index: number, field: keyof Language, value: string) => {
    if (!isEditing) return;
    
    setLanguages(prev => {
      const newLanguages = [...prev];
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: field === "proficiency" 
          ? (value as "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native") 
          : value
      };
      
      const newState = {
        ...initialResumeData,
        languages: newLanguages
      };
      
      updateResumeData(newState);
      return newLanguages;
    });
  };

  return {
    languages,
    handleLanguageUpdate
  };
}
