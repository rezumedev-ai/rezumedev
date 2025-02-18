
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
    <div className="mb-6">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
        Professional Experience
      </h3>
      <div className="space-y-5">
        {experiences.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-sm uppercase">
                {renderEditableText(exp.jobTitle, index, "jobTitle")}
              </h4>
              <span className="text-xs">
                {renderEditableText(exp.startDate, index, "startDate")} - {
                  exp.isCurrentJob ? 'Present' : renderEditableText(exp.endDate, index, "endDate")
                }
              </span>
            </div>
            <div className="text-sm font-semibold mb-2">
              {renderEditableText(exp.companyName, index, "companyName")}
            </div>
            <ul className="list-disc ml-4 text-sm space-y-1">
              {exp.responsibilities.map((resp, respIndex) => (
                <li key={respIndex} className="text-sm leading-tight">
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
