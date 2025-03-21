
import { useState, useEffect } from "react";
import { ResumeData } from "@/types/resume";
import { toast } from "sonner";
import { useResumePersonalInfo } from "./resume/use-resume-personal-info";
import { useResumeSummary } from "./resume/use-resume-summary";
import { useResumeSkills } from "./resume/use-resume-skills";
import { useResumeEducation } from "./resume/use-resume-education";
import { useResumeCertifications } from "./resume/use-resume-certifications";
import { useResumeExperience } from "./resume/use-resume-experience";
import { useResumeTemplate } from "./resume/use-resume-template";
import { useResumeLanguages } from "./resume/use-resume-languages";
import { useResumeProjects } from "./resume/use-resume-projects";

export function useResumePreview(initialResumeData: ResumeData, resumeId: string) {
  const [resumeState, setResumeState] = useState<ResumeData>(initialResumeData);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    // Initialize empty arrays for new sections if they don't exist
    const updatedData = {
      ...initialResumeData,
      languages: initialResumeData.languages || [],
      projects: initialResumeData.projects || []
    };
    setResumeState(updatedData);
  }, [initialResumeData]);
  
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Resume saved successfully");
    }
  };
  
  // Use all the specialized hooks
  const { personalInfo, handlePersonalInfoUpdate, handleProfileImageUpdate } = useResumePersonalInfo(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { summary, handleSummaryUpdate } = useResumeSummary(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { skills, handleSkillsUpdate } = useResumeSkills(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { education, handleEducationUpdate } = useResumeEducation(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { certifications, handleCertificationUpdate } = useResumeCertifications(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { experience, handleExperienceUpdate } = useResumeExperience(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { languages, handleLanguageUpdate } = useResumeLanguages(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { projects, handleProjectUpdate } = useResumeProjects(
    resumeState,
    resumeId,
    isEditing
  );
  
  const { templateId, isChangingTemplate, handleTemplateChange } = useResumeTemplate(
    resumeState,
    resumeId
  );
  
  // Update resumeState when any of the individual parts change
  useEffect(() => {
    setResumeState(prev => ({
      ...prev,
      personal_info: personalInfo,
      professional_summary: summary,
      skills: skills,
      education: education,
      certifications: certifications,
      work_experience: experience,
      languages: languages,
      projects: projects,
      template_id: templateId
    }));
  }, [personalInfo, summary, skills, education, certifications, experience, languages, projects, templateId]);
  
  return {
    resumeState,
    isEditing,
    isChangingTemplate,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleProfileImageUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleLanguageUpdate,
    handleProjectUpdate,
    handleTemplateChange
  };
}
