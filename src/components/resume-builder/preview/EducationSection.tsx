
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

  // Template-specific styles
  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      degree: "font-bold text-sm text-gray-800",
      school: "text-sm text-gray-700",
      date: "text-sm text-gray-500"
    },
    "modern-split": {
      section: "mb-5",
      title: "text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      degree: "font-medium text-xs text-gray-800",
      school: "text-xs text-gray-600",
      date: "text-[10px] text-gray-500"
    },
    "minimal-elegant": {
      section: "mb-10",
      title: "text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-medium text-center",
      degree: "font-medium text-sm text-gray-800",
      school: "text-[13px] text-gray-500",
      date: "text-xs text-gray-400"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      degree: "font-semibold text-[13px]",
      school: "text-[13px] text-gray-600",
      date: "text-[12px] text-gray-500"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
            Education
          </span>
        ) : (
          "Education"
        )}
      </h3>
      <div className={template.id === "minimal-elegant" ? "space-y-6 flex flex-col items-center" : "space-y-3"}>
        {education.map((edu, index) => (
          <div key={index} className={template.id === "minimal-elegant" ? "text-center w-full max-w-md" : ""}>
            {template.id === "minimal-elegant" ? (
              <>
                <h4 
                  className={`${currentStyle.degree} outline-none mb-1`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "degreeName", e)}
                >
                  {edu.degreeName}
                </h4>
                <div 
                  className={`${currentStyle.school} outline-none mb-1`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "schoolName", e)}
                >
                  {edu.schoolName}
                </div>
                <div className={currentStyle.date}>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "startDate", e)}
                    className="outline-none"
                  >
                    {edu.startDate}
                  </span>
                  {" — "}
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
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 
                    className={`${currentStyle.degree} outline-none`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "degreeName", e)}
                  >
                    {edu.degreeName}
                  </h4>
                  <span className={currentStyle.date}>
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
                  className={`${currentStyle.school} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "schoolName", e)}
                >
                  {edu.schoolName}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
