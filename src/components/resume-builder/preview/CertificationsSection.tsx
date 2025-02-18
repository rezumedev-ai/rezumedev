
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
    <div className="mb-6">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
        Certifications & Licenses
      </h3>
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div key={index} className="flex justify-between items-baseline">
            <div>
              <span className="font-bold text-sm">
                {renderEditableText(cert.name, index, "name")}
              </span>
              <span className="text-sm mx-2">|</span>
              <span className="text-sm">
                {renderEditableText(cert.organization, index, "organization")}
              </span>
            </div>
            <span className="text-xs">
              {renderEditableText(cert.completionDate, index, "completionDate")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
