
import { ResumeTemplate } from "./templates";
import { ResumeData, Education, Certification, WorkExperience } from "@/types/resume";
import { PersonalSection } from "./preview/PersonalSection";
import { ProfessionalSummarySection } from "./preview/ProfessionalSummarySection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { EducationSection } from "./preview/EducationSection";
import { SkillsSection } from "./preview/SkillsSection";
import { CertificationsSection } from "./preview/CertificationsSection";

interface ResumeContentProps {
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

export function ResumeContent({
  resumeState,
  template,
  isEditing,
  onPersonalInfoUpdate,
  onSummaryUpdate,
  onSkillsUpdate,
  onEducationUpdate,
  onCertificationUpdate,
  onExperienceUpdate
}: ResumeContentProps) {
  return (
    <>
      <PersonalSection 
        fullName={resumeState.personal_info.fullName}
        title={resumeState.professional_summary.title}
        email={resumeState.personal_info.email}
        phone={resumeState.personal_info.phone}
        linkedin={resumeState.personal_info.linkedin}
        website={resumeState.personal_info.website}
        template={template}
        isEditing={isEditing}
        onUpdate={onPersonalInfoUpdate}
      />
      
      <ProfessionalSummarySection 
        summary={resumeState.professional_summary.summary} 
        template={template}
        isEditing={isEditing}
        onUpdate={onSummaryUpdate}
      />
      
      <ExperienceSection 
        experiences={resumeState.work_experience} 
        template={template}
        isEditing={isEditing}
        onUpdate={onExperienceUpdate}
      />
      
      <EducationSection 
        education={resumeState.education} 
        template={template}
        isEditing={isEditing}
        onUpdate={onEducationUpdate}
      />
      
      <SkillsSection 
        hardSkills={resumeState.skills.hard_skills} 
        softSkills={resumeState.skills.soft_skills} 
        template={template}
        isEditing={isEditing}
        onUpdate={onSkillsUpdate}
      />
      
      <CertificationsSection 
        certifications={resumeState.certifications} 
        template={template}
        isEditing={isEditing}
        onUpdate={onCertificationUpdate}
      />
    </>
  );
}
