
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
    <div>
      <h3 className={template.style.sectionStyle}>
        Education
      </h3>
      <div className="space-y-4 mt-2">
        {education.map((edu, index) => (
          <div key={index}>
            <h4 className="font-medium">
              {renderEditableText(edu.degreeName, index, "degreeName")}
            </h4>
            <div className="text-gray-600">
              {renderEditableText(edu.schoolName, index, "schoolName")}
            </div>
            <div className="text-sm text-gray-500">
              {renderEditableText(edu.startDate, index, "startDate")} - {
                edu.isCurrentlyEnrolled ? 'Present' : renderEditableText(edu.endDate, index, "endDate")
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
