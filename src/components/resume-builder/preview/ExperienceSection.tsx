
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  template: ResumeTemplate;
}

export function ExperienceSection({ experiences, template }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  return (
    <div>
      <h3 className={template.style.sectionStyle}>
        Work Experience
      </h3>
      <div className="space-y-4 mt-2">
        {experiences.map((exp, index) => (
          <div key={index}>
            <h4 className="font-medium">{exp.jobTitle}</h4>
            <div className="text-gray-600">{exp.companyName}</div>
            <div className="text-sm text-gray-500">
              {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
            </div>
            <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
              {exp.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
