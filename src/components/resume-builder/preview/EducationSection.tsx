
import { SectionHeader } from "./SectionHeader";
import { Education } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { formatDateRange } from "@/utils/format-dates";

interface EducationSectionProps {
  education: Education[];
  template: ResumeTemplate;
  isEditing: boolean;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export function EducationSection({ education, template, isEditing, onUpdate }: EducationSectionProps) {
  if (education.length === 0) return null;

  const handleFieldEdit = (index: number, field: keyof Education, event: React.FocusEvent<HTMLElement>) => {
    if (!isEditing) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  return (
    <div className="mt-1">
      <SectionHeader title="Education" type="education" template={template} />
      
      <div className="space-y-3 mt-2">
        {education.map((edu, index) => (
          <div key={index} className={`${template.id === "modern-professional" ? 'pb-3' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div 
                  className={`font-semibold ${template.id === "modern-professional" ? 'text-gray-900' : ''}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldEdit(index, "degreeName", e)}
                >
                  {edu.degreeName}
                </div>
                <div 
                  className={`text-sm ${template.id === "modern-professional" ? 'text-gray-700' : 'text-gray-600'}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldEdit(index, "schoolName", e)}
                >
                  {edu.schoolName}
                </div>
              </div>
              <div 
                className={`text-sm ${template.id === "modern-professional" ? 'text-emerald-600 font-medium' : 'text-gray-500'} whitespace-nowrap`}
              >
                {formatDateRange(edu.startDate, edu.endDate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
