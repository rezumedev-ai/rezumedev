
import { Certification } from "@/types/resume";
import { ResumeTemplate } from "../templates";

interface CertificationsSectionProps {
  certifications: Certification[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof Certification, value: string) => void;
}

export function CertificationsSection({ 
  certifications, 
  template,
  isEditing,
  onUpdate 
}: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  const handleContentEdit = (
    index: number,
    field: keyof Certification,
    event: React.FocusEvent<HTMLElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  // Template-specific styles
  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      name: "font-bold text-sm text-gray-800",
      organization: "text-sm text-gray-700",
      date: "text-xs text-gray-500"
    },
    "modern-split": {
      section: "mb-6",
      title: "text-[13px] font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center",
      name: "font-medium text-[13px] text-gray-800",
      organization: "text-[13px] text-gray-600",
      date: "text-[12px] text-gray-500"
    },
    "minimal-elegant": {
      section: "mb-8",
      title: "text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium flex items-center gap-1.5 after:content-[''] after:h-px after:flex-grow after:bg-gray-200",
      name: "font-normal text-sm text-gray-700",
      organization: "text-xs text-gray-500 italic",
      date: "text-[11px] text-gray-400"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      name: "font-medium text-[13px]",
      organization: "text-[13px] text-gray-600",
      date: "text-[12px] text-gray-500"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-indigo-500 mr-2"></span>
            Certifications
          </span>
        ) : template.id === "professional-executive" ? (
          "Certifications"
        ) : template.id === "minimal-elegant" ? (
          <span>Certifications</span>
        ) : (
          "Certifications & Licenses"
        )}
      </h3>
      <div className={template.id === "minimal-elegant" ? "space-y-3" : template.id === "modern-split" ? "space-y-2" : "space-y-1.5"}>
        {certifications.map((cert, index) => (
          template.id === "minimal-elegant" ? (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-baseline">
                <span 
                  className={`${currentStyle.name} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "name", e)}
                >
                  {cert.name}
                </span>
                <span 
                  className={`${currentStyle.date} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "completionDate", e)}
                >
                  {cert.completionDate}
                </span>
              </div>
              <span 
                className={`${currentStyle.organization} outline-none block mt-0.5`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "organization", e)}
              >
                {cert.organization}
              </span>
            </div>
          ) : (
            <div key={index} className={
              template.id === "minimal-elegant" 
                ? "flex justify-between items-baseline w-full max-w-lg" 
                : template.id === "modern-split"
                ? "flex justify-between items-baseline w-full"
                : "flex justify-between items-baseline"
            }>
              <div>
                <span 
                  className={`${currentStyle.name} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "name", e)}
                >
                  {cert.name}
                </span>
                {template.id !== "professional-executive" && <span className="text-gray-500 mx-1">•</span>}
                <span 
                  className={`${currentStyle.organization} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "organization", e)}
                >
                  {cert.organization}
                </span>
              </div>
              <span 
                className={`${currentStyle.date} outline-none`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "completionDate", e)}
              >
                {cert.completionDate}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
