
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

  const handleProfileImageUpdate = (imageUrl: string | null) => {
    setPersonalInfo(prev => {
      const updated = {
        ...prev,
        profileImageUrl: imageUrl || undefined
      };
      
      const newState = {
        ...initialResumeData,
        personal_info: updated
      };
      
      updateResumeData(newState);

      // Also update the profile_image_url directly in the resumes table
      supabase
        .from('resumes')
        .update({ profile_image_url: imageUrl })
        .eq('id', resumeId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating profile image URL:", error);
          }
        });
      
      return updated;
    });
  };

  return {
    personalInfo,
    handlePersonalInfoUpdate,
    handleProfileImageUpdate
  };
}
