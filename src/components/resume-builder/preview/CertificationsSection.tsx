
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
    event: React.FocusEvent<HTMLDivElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
        Certifications & Licenses
      </h3>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <div>
              <span 
                className="font-bold text-sm outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "name", e)}
              >
                {cert.name}
              </span>
              <span className="text-sm mx-2">|</span>
              <span 
                className="text-sm outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "organization", e)}
              >
                {cert.organization}
              </span>
            </div>
            <span 
              className="text-xs outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(index, "completionDate", e)}
            >
              {cert.completionDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
