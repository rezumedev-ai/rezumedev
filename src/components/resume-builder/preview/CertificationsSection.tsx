
import React from 'react';
import { ResumeData, Certification } from "@/types/resume";
import { ResumeTemplate } from "@/components/resume-builder/templates";
import { formatDate } from "@/lib/utils";

interface CertificationsSectionProps {
  resumeData: ResumeData;
  template?: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof Certification, value: string) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ 
  resumeData,
  template,
  isEditing,
  onUpdate 
}) => {
  const { certifications } = resumeData;

  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Check if we're using one of these templates for conditional rendering
  const templateCondition = template?.id === "professional-navy" || template?.id === "modern-professional";

  return (
    <section className="mb-4" data-section="certifications">
      <h3 className={template?.style?.sectionStyle || "text-base font-semibold mb-3"}>Certifications</h3>
      <ul className="space-y-2 pdf-bullet-list" data-pdf-bullet-list="true">
        {certifications.map((certification, index) => (
          <li key={index} className="mb-2" data-cert-item="true">
            <div className="font-semibold text-[14px] text-gray-900">{certification.name}</div>
            {templateCondition && <div className="text-[13px] text-gray-600">{certification.organization}</div>}
            <div className="text-[13px] text-gray-500">
              {formatDate(certification.completionDate)} {certification.completionDate ? '•' : ''} {!templateCondition && certification.organization}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
