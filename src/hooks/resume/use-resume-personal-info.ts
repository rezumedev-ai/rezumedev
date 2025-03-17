
import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumePersonalInfo(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [personalInfo, setPersonalInfo] = useState(initialResumeData.personal_info);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          personal_info: data.personal_info,
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating personal info:", error);
        toast.error("Failed to save personal info changes");
      }
    } catch (error) {
      console.error("Error in updatePersonalInfo:", error);
      toast.error("Failed to save personal info changes");
    }
  };

  const handlePersonalInfoUpdate = (field: string, value: string) => {
    if (!isEditing) return;
    
    setPersonalInfo(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      const newState = {
        ...initialResumeData,
        personal_info: updated
      };
      
      updateResumeData(newState);
      return updated;
    });
  };

  return {
    personalInfo,
    handlePersonalInfoUpdate
  };
}
