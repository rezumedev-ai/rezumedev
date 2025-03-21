
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
  
  // Modern Professional layout has a special two-column layout
  if (template.id === "modern-professional") {
    return (
      <>
        <PersonalSection 
          personalInfo={resumeState.personal_info}
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
        
        <div className="grid grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-8">
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
          </div>
          
          {/* Right column */}
          <div className="col-span-4">
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
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <PersonalSection 
        personalInfo={resumeState.personal_info}
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
        certifications={resumeState.certifications} 
        template={template}
        isEditing={isEditing}
        onUpdate={onCertificationUpdate}
      />
    </>
  );
}
