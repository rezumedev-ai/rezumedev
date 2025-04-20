
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

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      content: "text-sm text-gray-700"
    },
    "modern-split": {
      section: "mb-4",
      title: "text-[13px] font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center",
      content: "text-[11px] text-gray-700 leading-tight"
    },
    "minimal-elegant": {
      section: "mb-5",
      title: "text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200",
      content: "text-[14px] text-gray-700 leading-relaxed"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      content: "text-[13px] text-gray-700"
    },
    "modern-professional": {
      section: "mb-5 col-span-12",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      content: "text-[14px] text-gray-700 leading-relaxed mt-2"
    },
    "professional-navy": {
      section: "mb-5",
      title: "text-base font-bold text-white uppercase tracking-wide mb-3 pb-1 border-b border-[#0F2B5B]",
      content: "text-[13px] text-white"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  if (template.id === "professional-navy") {
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

  if (template.id === "modern-professional") {
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

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1"></span>
            Professional Summary
          </span>
        ) : template.id === "minimal-elegant" ? (
          "Professional Summary"
        ) : (
          "Professional Summary"
        )}
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
