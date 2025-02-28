
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Briefcase } from "lucide-react";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof WorkExperience, value: string | string[]) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}

export function ExperienceSection({ 
  experiences, 
  template,
  isEditing,
  onUpdate,
  onAdd,
  onRemove
}: ExperienceSectionProps) {
  const handleContentEdit = (
    index: number,
    field: keyof WorkExperience,
    event: React.FocusEvent<HTMLElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  const handleResponsibilityEdit = (
    index: number,
    respIndex: number,
    event: React.FocusEvent<HTMLElement>
  ) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    const newResponsibilities = [...experiences[index].responsibilities];
    newResponsibilities[respIndex] = newValue;
    onUpdate(index, "responsibilities", newResponsibilities);
  };

  // Template-specific styles
  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      jobTitle: "font-bold text-base text-gray-800",
      company: "text-gray-700 font-medium text-sm",
      date: "text-sm text-gray-500",
      responsibilities: "mt-2 space-y-1.5 list-disc list-inside",
      responsibility: "text-sm text-gray-700"
    },
    "modern-split": {
      section: "mb-5",
      title: "text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      jobTitle: "font-medium text-sm text-gray-800",
      company: "text-gray-600 text-xs",
      date: "text-[10px] text-gray-500 whitespace-nowrap",
      responsibilities: "mt-1.5 space-y-1",
      responsibility: "text-xs text-gray-600 flex items-start"
    },
    "minimal-elegant": {
      section: "mb-6",
      title: "text-xs font-medium text-gray-400 uppercase tracking-widest mb-4 text-center",
      jobTitle: "font-medium text-base text-gray-800 text-center",
      company: "text-gray-500 text-sm text-center",
      date: "text-xs text-gray-500 text-center",
      responsibilities: "mt-3 space-y-1.5 text-center",
      responsibility: "text-sm text-gray-600"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      jobTitle: "font-bold uppercase text-gray-900 text-[14px]",
      company: "text-gray-700 font-semibold text-[13px]",
      date: "text-[12px] text-gray-500",
      responsibilities: "mt-2 space-y-1.5",
      responsibility: "text-[13px] text-gray-700 leading-snug flex items-start gap-2"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={currentStyle.title}>
          {template.id === "modern-split" ? (
            <span className="flex items-center">
              <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
              Professional Experience
            </span>
          ) : template.id === "minimal-elegant" ? (
            "Experience"
          ) : (
            "Professional Experience"
          )}
        </h3>
      </div>
      
      <div className={template.id === "modern-split" ? "space-y-4" : "space-y-5"}>
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className={
              template.id === "modern-split" 
                ? "relative pl-4 border-l border-indigo-100" 
                : template.id === "minimal-elegant"
                ? "border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                : "pb-3"
            }
          >
            {template.id === "modern-split" && (
              <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
            
            <div className={
              template.id === "minimal-elegant" 
                ? "flex flex-col items-center space-y-1"
                : "space-y-1"
            }>
              <div className="flex justify-between items-baseline gap-4">
                <div 
                  className={`${currentStyle.jobTitle} outline-none`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "jobTitle", e)}
                >
                  {exp.jobTitle}
                </div>
                <div className={currentStyle.date}>
                  <span
                    className="outline-none"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "startDate", e)}
                  >
                    {exp.startDate}
                  </span>
                  {" - "}
                  <span
                    className="outline-none"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(index, "endDate", e)}
                  >
                    {exp.isCurrentJob ? "Present" : exp.endDate}
                  </span>
                </div>
              </div>
              
              <div 
                className={`${currentStyle.company} outline-none`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "companyName", e)}
              >
                {exp.companyName}
              </div>
              
              <ul className={currentStyle.responsibilities}>
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className={currentStyle.responsibility}>
                    {template.id === "modern-split" && (
                      <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mt-1.5 mr-2"></span>
                    )}
                    {template.id === "professional-executive" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-black mt-[6px] shrink-0"></div>
                    )}
                    <span
                      className="outline-none"
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => handleResponsibilityEdit(index, respIndex, e)}
                    >
                      {resp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
