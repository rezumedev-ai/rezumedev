
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { resumeTemplates } from "./templates";
import { ResumePreviewToolbar } from "./preview/ResumePreviewToolbar";
import { useResumePreview } from "@/hooks/use-resume-preview";
import { ResumeViewer } from "./preview/ResumeViewer";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  resumeId: string;
}

export function FinalResumePreview({ 
  resumeData, 
  resumeId
}: FinalResumePreviewProps) {
  const navigate = useNavigate();
  
  const {
    resumeState,
    isEditing,
    toggleEditMode,
    handlePersonalInfoUpdate,
    handleSummaryUpdate,
    handleSkillsUpdate,
    handleEducationUpdate,
    handleCertificationUpdate,
    handleExperienceUpdate,
    handleTemplateChange
  } = useResumePreview(resumeData, resumeId);
  
  // Get the template
  const template = resumeTemplates.find(t => t.id === resumeState.template_id) || resumeTemplates[0];
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-8">
      <ResumePreviewToolbar 
        currentTemplateId={template.id}
        templates={resumeTemplates}
        resumeId={resumeId}
        onTemplateChange={handleTemplateChange}
        onBackToDashboard={() => navigate("/dashboard")}
        isEditing={isEditing}
        onToggleEdit={toggleEditMode}
      />
      
      <ResumeViewer 
        resumeState={resumeState}
        template={template}
        isEditing={isEditing}
        onPersonalInfoUpdate={handlePersonalInfoUpdate}
        onSummaryUpdate={handleSummaryUpdate}
        onSkillsUpdate={handleSkillsUpdate}
        onEducationUpdate={handleEducationUpdate}
        onCertificationUpdate={handleCertificationUpdate}
        onExperienceUpdate={handleExperienceUpdate}
      />
    </div>
  );
}
