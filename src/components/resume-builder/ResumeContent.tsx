
import { ResumeTemplate } from "./templates";
import { ResumeData, Education, Certification, WorkExperience } from "@/types/resume";
import { PersonalSection } from "./preview/PersonalSection";
import { ProfessionalSummarySection } from "./preview/ProfessionalSummarySection";
import { ExperienceSection } from "./preview/ExperienceSection";
import { EducationSection } from "./preview/EducationSection";
import { SkillsSection } from "./preview/SkillsSection";
import { CertificationsSection } from "./preview/CertificationsSection";
import { TwoColumnLayout } from "./preview/layouts/TwoColumnLayout";

interface ResumeContentProps {
  resumeState: ResumeData;
  template: ResumeTemplate;
  isEditing: boolean;
  resumeId: string;
  onPersonalInfoUpdate: (field: string, value: string) => void;
  onProfileImageUpdate?: (imageUrl: string | null) => void;
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
  resumeId,
  onPersonalInfoUpdate,
  onProfileImageUpdate,
  onSummaryUpdate,
  onSkillsUpdate,
  onEducationUpdate,
  onCertificationUpdate,
  onExperienceUpdate
}: ResumeContentProps) {

  // Create a function to handle the WorkExperience array updates for the ExperienceSection
  const handleExperienceArrayUpdate = (experiences: WorkExperience[]) => {
    // Since we're replacing the entire array, we don't need index or field
    // We'll just update the resume state with the new array
    resumeState.work_experience = experiences;
  };

  const renderSpecialTemplate = () => {
    // Special handling for Professional Navy template
    if (template.id === "professional-navy") {
      return (
        <>
          <PersonalSection
            fullName={resumeState.personal_info.fullName}
            title={resumeState.professional_summary.title}
            email={resumeState.personal_info.email}
            phone={resumeState.personal_info.phone}
            linkedin={resumeState.personal_info.linkedin}
            website={resumeState.personal_info.website}
            profileImageUrl={resumeState.personal_info.profileImageUrl}
            template={template}
            isEditing={isEditing}
            resumeId={resumeId}
            onUpdate={onPersonalInfoUpdate}
            onImageUpdate={onProfileImageUpdate}
          />

          <TwoColumnLayout
            className="px-8"
            leftContent={
              <>
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
                  onUpdate={handleExperienceArrayUpdate}
                />

                <EducationSection
                  education={resumeState.education}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onEducationUpdate}
                />
              </>
            }
            rightContent={
              <>
                <SkillsSection
                  hardSkills={resumeState.skills.hard_skills}
                  softSkills={resumeState.skills.soft_skills}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onSkillsUpdate}
                />

                <CertificationsSection
                  resumeData={resumeState}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onCertificationUpdate}
                />
              </>
            }
          />
        </>


      );
    }

    // Creative Portfolio Layout (Sidebar/Grid)
    if (template.id === "creative-portfolio") {
      return (
        <>
          {/* Header spans full width */}
          <PersonalSection
            fullName={resumeState.personal_info.fullName}
            title={resumeState.professional_summary.title}
            email={resumeState.personal_info.email}
            phone={resumeState.personal_info.phone}
            linkedin={resumeState.personal_info.linkedin}
            website={resumeState.personal_info.website}
            profileImageUrl={resumeState.personal_info.profileImageUrl}
            template={template}
            isEditing={isEditing}
            resumeId={resumeId}
            onUpdate={onPersonalInfoUpdate}
            onImageUpdate={onProfileImageUpdate}
          />

          <TwoColumnLayout
            leftContent={
              <>
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
                  onUpdate={handleExperienceArrayUpdate}
                />

                <EducationSection
                  education={resumeState.education}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onEducationUpdate}
                />
              </>
            }
            rightContent={
              <>
                <SkillsSection
                  hardSkills={resumeState.skills.hard_skills}
                  softSkills={resumeState.skills.soft_skills}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onSkillsUpdate}
                />

                <CertificationsSection
                  resumeData={resumeState}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onCertificationUpdate}
                />
              </>
            }
          />
        </>
      );
    }

    // Modern Professional layout has a special two-column layout
    if (template.id === "modern-professional") {
      return (
        <>
          <PersonalSection
            fullName={resumeState.personal_info.fullName}
            title={resumeState.professional_summary.title}
            email={resumeState.personal_info.email}
            phone={resumeState.personal_info.phone}
            linkedin={resumeState.personal_info.linkedin}
            website={resumeState.personal_info.website}
            profileImageUrl={resumeState.personal_info.profileImageUrl}
            template={template}
            isEditing={isEditing}
            resumeId={resumeId}
            onUpdate={onPersonalInfoUpdate}
            onImageUpdate={onProfileImageUpdate}
          />

          <ProfessionalSummarySection
            summary={resumeState.professional_summary.summary}
            template={template}
            isEditing={isEditing}
            onUpdate={onSummaryUpdate}
          />

          <TwoColumnLayout
            leftContent={
              <>
                <ExperienceSection
                  experiences={resumeState.work_experience}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={handleExperienceArrayUpdate}
                />

                <EducationSection
                  education={resumeState.education}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onEducationUpdate}
                />
              </>
            }
            rightContent={
              <>
                <SkillsSection
                  hardSkills={resumeState.skills.hard_skills}
                  softSkills={resumeState.skills.soft_skills}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onSkillsUpdate}
                />

                <CertificationsSection
                  resumeData={resumeState}
                  template={template}
                  isEditing={isEditing}
                  onUpdate={onCertificationUpdate}
                />
              </>
            }
          />
        </>
      );
    }

    return null;
  };

  // For regular templates with a standard layout
  const renderStandardTemplate = () => {
    return (
      <>
        <PersonalSection
          fullName={resumeState.personal_info.fullName}
          title={resumeState.professional_summary.title}
          email={resumeState.personal_info.email}
          phone={resumeState.personal_info.phone}
          linkedin={resumeState.personal_info.linkedin}
          website={resumeState.personal_info.website}
          profileImageUrl={resumeState.personal_info.profileImageUrl}
          template={template}
          isEditing={isEditing}
          resumeId={resumeId}
          onUpdate={onPersonalInfoUpdate}
          onImageUpdate={onProfileImageUpdate}
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
          onUpdate={handleExperienceArrayUpdate}
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
          resumeData={resumeState}
          template={template}
          isEditing={isEditing}
          onUpdate={onCertificationUpdate}
        />
      </>
    );
  };

  // First check if we need to render a special template layout
  const specialTemplate = renderSpecialTemplate();
  if (specialTemplate) {
    return specialTemplate;
  }

  // Otherwise use the standard layout
  return renderStandardTemplate();
}
