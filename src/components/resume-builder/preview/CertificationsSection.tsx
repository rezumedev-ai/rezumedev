
import { Certification } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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

  const renderEditableText = (
    text: string, 
    index: number, 
    field: keyof Certification
  ) => {
    if (!isEditing) return text;

    return (
      <Input
        value={text}
        onChange={(e) => onUpdate?.(index, field, e.target.value)}
        className="w-full"
      />
    );
  };

  return (
    <div>
      <h3 className={template.style.sectionStyle}>
        Certifications
      </h3>
      <div className="space-y-4 mt-2">
        {certifications.map((cert, index) => (
          <div key={index}>
            <h4 className="font-medium">
              {renderEditableText(cert.name, index, "name")}
            </h4>
            <div className="text-gray-600">
              {renderEditableText(cert.organization, index, "organization")}
            </div>
            <div className="text-sm text-gray-500">
              {renderEditableText(cert.completionDate, index, "completionDate")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
