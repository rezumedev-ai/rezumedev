
import { useState } from "react";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResumeTemplate(
  initialResumeData: ResumeData,
  resumeId: string
) {
  const [templateId, setTemplateId] = useState(initialResumeData.template_id);
  const [isChangingTemplate, setIsChangingTemplate] = useState(false);

  const updateResumeData = async (data: ResumeData) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          template_id: data.template_id
        })
        .eq('id', resumeId);
        
      if (error) {
        console.error("Error updating template:", error);
        toast.error("Failed to update template");
      }
    } catch (error) {
      console.error("Error in updateTemplate:", error);
      toast.error("Failed to update template");
    }
  };

  const handleTemplateChange = async (newTemplateId: string) => {
    try {
      setIsChangingTemplate(true);
      
      setTemplateId(newTemplateId);
      const newState = {
        ...initialResumeData,
        template_id: newTemplateId
      };
      
      await updateResumeData(newState);
      
    } catch (error) {
      console.error("Error changing template:", error);
      toast.error("Failed to update template");
    } finally {
      setTimeout(() => {
        setIsChangingTemplate(false);
      }, 500);
    }
  };

  return {
    templateId,
    isChangingTemplate,
    handleTemplateChange
  };
}
