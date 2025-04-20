import { ResumeTemplate } from "../templates";
import { SectionHeader } from "./SectionHeader";
import { WorkExperience } from "@/types/resume";
import { formatDate } from "@/lib/utils";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (experiences: WorkExperience[]) => void;
}

export function ExperienceSection({ 
  experiences, 
  template,
  isEditing,
  onUpdate
}: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      experience: "mb-4"
    },
    "modern-split": {
      section: "mb-4",
      title: "text-[13px] font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center",
      experience: "mb-3"
    },
    "minimal-elegant": {
      section: "mb-5",
      title: "text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200",
      experience: "mb-4"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      experience: "mb-4"
    },
    "modern-professional": {
      section: "mb-5",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      experience: "mb-4"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const renderExperiences = () => {
    return experiences.map((exp, index) => (
      <div key={index} className={currentStyle.experience}>
        <h4 className="font-semibold">{exp.jobTitle}</h4>
        <div className="text-sm text-gray-500">
          {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
        </div>
        <div className="text-gray-600">{exp.companyName}</div>
        <ul className="list-disc ml-4 mt-2 text-gray-700 space-y-1">
          {exp.responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      </div>
    ));
  };

  if (template.id === "modern-professional") {
    return (
      <div>
        {/* Conditionally render SectionHeader only if icons are enabled */}
        {template.style.icons.sections && (
          <SectionHeader title="Work Experience" type="experience" template={template} />
        )}
        {/* If icons are disabled, render the title manually */}
        {!template.style.icons.sections && (
          <h3 className={currentStyle.title}>Work Experience</h3>
        )}
        <div className="space-y-4">
          {renderExperiences()}
        </div>
      </div>
    );
  }

  return (
    <div className={currentStyle.section}>
      <SectionHeader title="Work Experience" type="experience" template={template} />
      {renderExperiences()}
    </div>
  );
}
