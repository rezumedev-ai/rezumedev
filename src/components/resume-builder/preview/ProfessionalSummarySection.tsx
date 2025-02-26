
import { ResumeTemplate } from "../templates";

interface ProfessionalSummarySectionProps {
  summary: string;
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (value: string) => void;
}

export function ProfessionalSummarySection({
  summary,
  template,
  isEditing,
  onUpdate
}: ProfessionalSummarySectionProps) {
  const handleContentEdit = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(newValue);
  };

  return (
    <div className="mb-4">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-3 border-b border-black pb-1">
        Professional Summary
      </h3>
      <div
        className="text-sm leading-relaxed outline-none"
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleContentEdit}
      >
        {summary}
      </div>
    </div>
  );
}
