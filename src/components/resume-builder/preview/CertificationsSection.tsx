
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
      section: "mb-5",
      title: "text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      name: "font-medium text-xs text-gray-800",
      organization: "text-xs text-gray-600",
      date: "text-[10px] text-gray-500"
    },
    "minimal-elegant": {
      section: "mb-10",
      title: "text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-medium text-center",
      name: "font-medium text-sm text-gray-800",
      organization: "text-[13px] text-gray-500",
      date: "text-xs text-gray-400"
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
            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
            Certifications
          </span>
        ) : template.id === "professional-executive" ? (
          "Certifications"
        ) : template.id === "minimal-elegant" ? (
          "Certifications"
        ) : (
          "Certifications & Licenses"
        )}
      </h3>
      <div className={template.id === "minimal-elegant" ? "space-y-4 flex flex-col items-center" : "space-y-2"}>
        {certifications.map((cert, index) => (
          template.id === "minimal-elegant" ? (
            <div key={index} className="text-center w-full max-w-md">
              <span 
                className={`${currentStyle.name} outline-none block mb-1`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "name", e)}
              >
                {cert.name}
              </span>
              <span 
                className={`${currentStyle.organization} outline-none block mb-1`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "organization", e)}
              >
                {cert.organization}
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
          ) : (
            <div key={index} className={
              template.id === "minimal-elegant" 
                ? "flex justify-between items-baseline w-full max-w-lg" 
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
                {template.id !== "professional-executive" && <span className="text-gray-500 mx-2">•</span>}
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
