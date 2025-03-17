
import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumeSummary(
  initialResumeData: ResumeData,
  resumeId: string,
  isEditing: boolean
) {
  const [summary, setSummary] = useState(initialResumeData.professional_summary);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          professional_summary: data.professional_summary,
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating professional summary:", error);
        toast.error("Failed to save summary changes");
      }
    } catch (error) {
      console.error("Error in updateSummary:", error);
      toast.error("Failed to save summary changes");
    }
  };

  const handleSummaryUpdate = (summary: string) => {
    if (!isEditing) return;
    
    setSummary(prev => {
      const updated = {
        ...prev,
        summary
      };
      
      const newState = {
        ...initialResumeData,
        professional_summary: updated
      };
      
      updateResumeData(newState);
      return updated;
    });
  };

  return {
    summary,
    handleSummaryUpdate
  };
}
