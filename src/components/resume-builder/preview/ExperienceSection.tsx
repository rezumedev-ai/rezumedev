
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof WorkExperience, value: string | string[]) => void;
}

export function ExperienceSection({ 
  experiences, 
  template,
  isEditing,
  onUpdate 
}: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  const renderEditableText = (
    text: string, 
    index: number, 
    field: keyof WorkExperience
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
        Work Experience
      </h3>
      <div className="space-y-4 mt-2">
        {experiences.map((exp, index) => (
          <div key={index}>
            <h4 className="font-medium">
              {renderEditableText(exp.jobTitle, index, "jobTitle")}
            </h4>
            <div className="text-gray-600">
              {renderEditableText(exp.companyName, index, "companyName")}
            </div>
            <div className="text-sm text-gray-500">
              {renderEditableText(exp.startDate, index, "startDate")} - {
                exp.isCurrentJob ? 'Present' : renderEditableText(exp.endDate, index, "endDate")
              }
            </div>
            <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
              {exp.responsibilities.map((resp, respIndex) => (
                <li key={respIndex}>
                  {isEditing ? (
                    <Input
                      value={resp}
                      onChange={(e) => {
                        const newResp = [...exp.responsibilities];
                        newResp[respIndex] = e.target.value;
                        onUpdate?.(index, "responsibilities", newResp);
                      }}
                      className="w-full"
                    />
                  ) : resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
