
import React from 'react';
import { ResumeData, Certification } from "@/types/resume";
import { ResumeTemplate } from "@/components/resume-builder/templates";

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
  const templateCondition = template?.id === "professional-navy" || template?.id === "modern-split";

  return (
    <section className="mb-4">
      <h3 className={template?.style?.sectionStyle || "text-lg font-semibold mb-2"}>Certifications</h3>
      <ul>
        {certifications.map((certification, index) => (
          <li key={index} className="mb-2">
            <div className="font-semibold">{certification.name}</div>
            {templateCondition && <div className="text-sm text-gray-600">{certification.organization}</div>}
            <div className="text-sm text-gray-500">
              {certification.completionDate} {certification.completionDate ? '•' : ''} {certification.organization}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
