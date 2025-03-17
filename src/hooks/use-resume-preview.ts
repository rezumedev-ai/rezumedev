
import { useState, useEffect } from "react";
import { ResumeData } from "@/types/resume";
import { toast } from "sonner";
import { createUpdateHandlers } from "./use-resume-data-updater";
import { useTemplateManager } from "./use-template-manager";

export function useResumePreview(initialResumeData: ResumeData, resumeId: string) {
  const [resumeState, setResumeState] = useState<ResumeData>(initialResumeData);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    setResumeState(initialResumeData);
  }, [initialResumeData]);
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Resume saved successfully");
    }
  };
  
  // Get update handlers for each section
  const {
    handlePersonalInfoUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate
  } = createUpdateHandlers(resumeState, setResumeState, resumeId, isEditing);
  
  // Get template management functions
  const { isChangingTemplate, handleTemplateChange } = useTemplateManager(
    resumeState, 
    setResumeState, 
    resumeId
  );
  
  return {
    resumeState,
    isEditing,
    isChangingTemplate,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleTemplateChange
  };
}
