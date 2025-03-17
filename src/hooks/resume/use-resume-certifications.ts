
import { useState } from "react";
import { ResumeData, Certification } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export function useResumeCertifications(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [certifications, setCertifications] = useState(initialResumeData.certifications);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          certifications: data.certifications as unknown as Json[],
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating certifications:", error);
        toast.error("Failed to save certifications changes");
      }
    } catch (error) {
      console.error("Error in updateCertifications:", error);
      toast.error("Failed to save certifications changes");
    }
  };

  const handleCertificationUpdate = (index: number, field: keyof Certification, value: string) => {
    if (!isEditing) return;
    
    setCertifications(prev => {
      const newCertifications = [...prev];
      newCertifications[index] = {
        ...newCertifications[index],
        [field]: value
      };
      
      const newState = {
        ...initialResumeData,
        certifications: newCertifications
      };
      
      updateResumeData(newState);
      return newCertifications;
    });
  };

  return {
    certifications,
    handleCertificationUpdate
  };
}
