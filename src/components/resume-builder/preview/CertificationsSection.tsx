
import { Certification } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";

interface CertificationsSectionProps {
  certifications: Certification[];
  template: ResumeTemplate;
}

export function CertificationsSection({ certifications, template }: CertificationsSectionProps) {
  if (certifications.length === 0) return null;

  return (
    <div>
      <h3 className={template.style.sectionStyle}>
        Certifications
      </h3>
      <div className="space-y-4 mt-2">
        {certifications.map((cert, index) => (
          <div key={index}>
            <h4 className="font-medium">{cert.name}</h4>
            <div className="text-gray-600">{cert.organization}</div>
            <div className="text-sm text-gray-500">
              {formatDate(cert.completionDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
