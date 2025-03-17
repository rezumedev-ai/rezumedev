
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
      section: "mb-5",
      title: "text-[20px] font-bold text-gray-800 uppercase tracking-wide mb-3 pb-2 border-b border-gray-300",
      degree: "font-bold text-base text-gray-800",
      school: "text-base text-gray-700",
      date: "text-[15px] text-gray-500"
    },
    "modern-split": {
      section: "mb-4",
      title: "text-[14px] font-bold text-gray-800 uppercase tracking-wider mb-2",
      degree: "font-semibold text-[13px] text-gray-800",
      school: "text-[12px] text-gray-600",
      date: "text-[11px] text-gray-500"
    },
    "minimal-elegant": {
      section: "mb-8",
      title: "text-[14px] uppercase tracking-[0.2em] text-gray-400 mb-5 font-medium text-center",
      degree: "font-medium text-base text-gray-800",
      school: "text-[15px] text-gray-500",
      date: "text-[14px] text-gray-400"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-[18px] font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      degree: "font-semibold text-[15px]",
      school: "text-[15px] text-gray-600",
      date: "text-[14px] text-gray-500"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-3 h-0.5 bg-gray-400 mr-1"></span>
            Education
          </span>
        ) : (
          "Education"
        )}
      </h3>
      <div className={template.id === "minimal-elegant" ? "space-y-5 flex flex-col items-center" : template.id === "modern-split" ? "space-y-2" : "space-y-3"}>
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
                <div className="flex justify-between items-baseline mb-0.5">
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
