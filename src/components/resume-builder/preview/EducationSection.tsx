import { ResumeTemplate } from "../templates";
import { SectionHeader } from "./SectionHeader";
import { Education } from "@/types/resume";
import { formatDate } from "@/lib/utils";

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
  if (!education || education.length === 0) return null;

  const styles = {
    "modern-professional": {
      section: "mb-5",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      education: "mb-4"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const renderEducation = () => {
    return education.map((edu, index) => (
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
    ));
  };

  const handleFieldEdit = (index: number, field: keyof Education, event: React.FocusEvent<HTMLElement>) => {
    if (!isEditing) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  if (template.id === "modern-professional") {
    return (
      <div>
        {template.style.icons.sections && (
          <SectionHeader title="Education" type="education" template={template} />
        )}
        {!template.style.icons.sections && (
          <h3 className={currentStyle.title}>Education</h3>
        )}
        <div className="space-y-4">
          {renderEducation()}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1">
      <SectionHeader title="Education" type="education" template={template} />
      
      <div className="space-y-3 mt-2">
        {renderEducation()}
      </div>
    </div>
  );
}
