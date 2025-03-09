
import { ResumeTemplate } from "../templates";
import { ResumeContent } from "../ResumeContent";
import { ResumeData } from "@/types/resume";

interface ResumeViewerProps {
  resumeState: ResumeData;
  template: ResumeTemplate;
  isEditing: boolean;
  onPersonalInfoUpdate: (field: string, value: string) => void;
  onSummaryUpdate: (summary: string) => void;
  onSkillsUpdate: (type: "hard" | "soft", skills: string[]) => void;
  onEducationUpdate: (index: number, field: keyof Education, value: string) => void;
  onCertificationUpdate: (index: number, field: keyof Certification, value: string) => void;
  onExperienceUpdate: (index: number, field: keyof WorkExperience, value: string | string[]) => void;
}

export function ResumeViewer({
  resumeState,
  template,
  isEditing,
  onPersonalInfoUpdate,
  onSummaryUpdate,
  onSkillsUpdate,
  onEducationUpdate,
  onCertificationUpdate,
  onExperienceUpdate
}: ResumeViewerProps) {
  // Prepare page style based on template
  const pageStyle = {
    padding: template.style.spacing.margins.top,
    fontFamily: template.style.titleFont?.split(' ')[0].replace('font-', '') || 'sans'
  };

  return (
    <div 
      className="w-[21cm] min-h-[29.7cm] bg-white shadow-xl mx-auto mb-10 relative"
      style={pageStyle}
    >
      <ResumeContent 
        resumeState={resumeState}
        template={template}
        isEditing={isEditing}
        onPersonalInfoUpdate={onPersonalInfoUpdate}
        onSummaryUpdate={onSummaryUpdate}
        onSkillsUpdate={onSkillsUpdate}
        onEducationUpdate={onEducationUpdate}
        onCertificationUpdate={onCertificationUpdate}
        onExperienceUpdate={onExperienceUpdate}
      />
    </div>
  );
}
