
import { useState } from "react";
import { ResumeData, Education } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export function useResumeEducation(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [education, setEducation] = useState(initialResumeData.education);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          education: data.education as unknown as Json[],
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating education:", error);
        toast.error("Failed to save education changes");
      }
    } catch (error) {
      console.error("Error in updateEducation:", error);
      toast.error("Failed to save education changes");
    }
  };

  const handleEducationUpdate = (index: number, field: keyof Education, value: string) => {
    if (!isEditing) return;
    
    setEducation(prev => {
      const newEducation = [...prev];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
      
      const newState = {
        ...initialResumeData,
        education: newEducation
      };
      
      updateResumeData(newState);
      return newEducation;
    });
  };

  return {
    education,
    handleEducationUpdate
  };
}
