
import { Education } from "@/types/resume";
import { ResumeTemplate } from "../templates";

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

  const handleContentEdit = (
    index: number,
    field: keyof Education,
    event: React.FocusEvent<HTMLElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
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
              <h4 
                className="font-bold text-sm outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "degreeName", e)}
              >
                {edu.degreeName}
              </h4>
              <span className="text-xs">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "startDate", e)}
                  className="outline-none"
                >
                  {edu.startDate}
                </span>
                {" - "}
                {edu.isCurrentlyEnrolled ? "Present" : (
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "endDate", e)}
                    className="outline-none"
                  >
                    {edu.endDate}
                  </span>
                )}
              </span>
            </div>
            <div 
              className="text-sm outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(index, "schoolName", e)}
            >
              {edu.schoolName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
