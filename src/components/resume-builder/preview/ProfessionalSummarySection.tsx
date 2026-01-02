import { ResumeTemplate } from "../templates";
import { SectionHeader } from "./SectionHeader";

interface ProfessionalSummarySectionProps {
  summary: string;
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (summary: string) => void;
}

export function ProfessionalSummarySection({
  summary,
  template,
  isEditing,
  onUpdate
}: ProfessionalSummarySectionProps) {
  if (!summary) return null;

  const handleSummaryEdit = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!isEditing || !onUpdate) return;
    const newSummary = event.target.innerText.trim();
    onUpdate(newSummary);
  };

  // Standardized styles based on modern-professional
  const styles = {
    "executive-clean": {
      section: "mb-5",
      // Using modern-professional-like section title styling while keeping brand colors
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-3",
      // Standardizing content font size
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "modern-split": {
      section: "mb-5",
      title: "text-base font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center",
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "minimal-elegant": {
      section: "mb-5",
      title: "text-base font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200",
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "professional-navy": {
      section: "mb-5",
      title: "text-base font-bold uppercase tracking-wide text-[#0F2B5B] mb-3 pb-1 border-b-2 border-[#0F2B5B]",
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "modern-professional": {
      section: "mb-5 col-span-12",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      content: "text-[14px] text-gray-700 leading-relaxed mt-2"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["modern-professional"];

  if (template.id === "modern-professional" || template.id === "professional-navy" || template.id === "creative-portfolio") {
    return (
      <div className={currentStyle.section}>
        <SectionHeader title="Professional Summary" type="summary" template={template} />
        <div
          className={`${currentStyle.content} outline-none`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={handleSummaryEdit}
        >
          {summary}
        </div>
      </div>
    );
  }

  // Standard rendering for other templates
  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        Professional Summary
      </h3>
      <div
        className={`${currentStyle.content} outline-none`}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleSummaryEdit}
      >
        {summary}
      </div>
    </div>
  );
}
