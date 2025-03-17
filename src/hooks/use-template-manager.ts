
import { useState } from 'react';
import { ResumeData } from "@/types/resume";
import { updateResumeData } from './use-resume-data-updater';
import { toast } from "sonner";

export function useTemplateManager(
  resumeState: ResumeData, 
  setResumeState: React.Dispatch<React.SetStateAction<ResumeData>>,
  resumeId: string
) {
  const [isChangingTemplate, setIsChangingTemplate] = useState(false);
  
  // Handle template changes
  const handleTemplateChange = async (templateId: string) => {
    try {
      setIsChangingTemplate(true);
      
      setResumeState(prev => {
        const newState = {
          ...prev,
          template_id: templateId
        };
        
        // Update in Supabase
        updateResumeData(newState, resumeId);
        return newState;
      });
      
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
    isChangingTemplate,
    handleTemplateChange
  };
}
