
import { ResumeTemplate } from "../templates";
import { File, Briefcase, Award, GraduationCap, Lightbulb } from "lucide-react";

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
    "modern-executive": {
      section: "mb-5",
      title: "text-[16px] font-semibold text-blue-950 flex items-center gap-2 before:content-[''] before:w-6 before:h-[2px] before:bg-blue-950 uppercase tracking-wider mb-4",
      content: "text-[13px] text-slate-700"
    },
    "tech-innovator": {
      section: "mb-5",
      title: "flex items-center text-[15px] font-bold text-emerald-800 uppercase tracking-wider mb-4 after:content-[''] after:flex-grow after:h-[2px] after:bg-gradient-to-r after:from-emerald-500 after:to-transparent after:ml-3",
      content: "text-[14px] text-slate-700"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const getSectionIcon = () => {
    if (template.id === "tech-innovator") {
      return <File className="w-4 h-4 mr-2 text-emerald-600" />;
    } else if (template.id === "modern-executive") {
      return <File className="w-4 h-4 mr-2 text-blue-600" />;
    } else if (template.id === "minimal-elegant") {
      return <File className="w-4 h-4 mr-2 text-black" />;
    } else if (template.id === "modern-split") {
      return <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1"></span>;
    } else {
      return null;
    }
  };

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.style.icons.sections ? (
          <span className="flex items-center">
            {getSectionIcon()}
            Professional Summary
          </span>
        ) : template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1"></span>
            Professional Summary
          </span>
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
