
import { Education } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";

interface EducationSectionProps {
  education: Education[];
  template: ResumeTemplate;
}

export function EducationSection({ education, template }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <div>
      <h3 className={template.style.sectionStyle}>
        Education
      </h3>
      <div className="space-y-4 mt-2">
        {education.map((edu, index) => (
          <div key={index}>
            <h4 className="font-medium">{edu.degreeName}</h4>
            <div className="text-gray-600">{edu.schoolName}</div>
            <div className="text-sm text-gray-500">
              {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
