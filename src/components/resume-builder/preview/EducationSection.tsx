
import { Education } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface EducationSectionProps {
  education: Education[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof Education, value: string) => void;
}

export function EducationSection({ 
  education, 
  template,
  isEditing,
  onUpdate 
}: EducationSectionProps) {
  if (education.length === 0) return null;

  const renderEditableText = (
    text: string, 
    index: number, 
    field: keyof Education
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
        Education
      </h3>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index}>
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-bold text-sm">
                {renderEditableText(edu.degreeName, index, "degreeName")}
              </h4>
              <span className="text-xs">
                {renderEditableText(edu.startDate, index, "startDate")} - {
                  edu.isCurrentlyEnrolled ? 'Present' : renderEditableText(edu.endDate, index, "endDate")
                }
              </span>
            </div>
            <div className="text-sm">
              {renderEditableText(edu.schoolName, index, "schoolName")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
