import React from 'react';
import { ResumeData } from "@/types/resume";
import { SectionTitle } from "@/components/resume-builder/preview/SectionTitle";
import { useResumeContext } from "@/context/ResumeContext";

interface CertificationsSectionProps {
  resumeData: ResumeData;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ resumeData }) => {
  const { certifications } = resumeData;
  const { currentTemplate } = useResumeContext();

  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Fix the template condition comparison
  const templateCondition = currentTemplate === "professional-navy" || currentTemplate === "modern-split";

  return (
    <section className="mb-4">
      <SectionTitle title="Certifications" />
      <ul>
        {certifications.map((certification, index) => (
          <li key={index} className="mb-2">
            <div className="font-semibold">{certification.name}</div>
            {templateCondition && <div className="text-sm text-gray-600">{certification.issuingOrganization}</div>}
            <div className="text-sm text-gray-500">
              {certification.issueDate} - {certification.expirationDate || 'No Expiration'}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
