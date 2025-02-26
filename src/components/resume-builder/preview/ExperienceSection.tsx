
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

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
          Professional Experience
        </h3>
      </div>
      
      <div className="space-y-3">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pb-3">
            <div className="space-y-1">
              <div className="flex justify-between items-baseline gap-4">
                <div 
                  className="flex-1 font-medium outline-none"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(index, "jobTitle", e)}
                >
                  {exp.jobTitle}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
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
                className="text-gray-600 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(index, "companyName", e)}
              >
                {exp.companyName}
              </div>
              
              <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="group">
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
