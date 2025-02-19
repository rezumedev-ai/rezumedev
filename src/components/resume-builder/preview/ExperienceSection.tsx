
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className={template.style.sectionStyle}>
          <Briefcase className="w-4 h-4" />
          Professional Experience
        </h3>
        {isEditing && onAdd && (
          <Button onClick={onAdd} variant="ghost" size="sm" className="h-7 text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {experiences.map((exp, index) => (
          <div key={index} className="relative pb-3">
            {isEditing && onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-1 -top-1 h-6 w-6 text-gray-400 hover:text-red-500"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            
            <div className="space-y-1">
              <div className="flex justify-between items-baseline gap-4">
                <div className="flex-1 font-medium">
                  {isEditing ? (
                    <Input
                      value={exp.jobTitle}
                      onChange={(e) => onUpdate?.(index, "jobTitle", e.target.value)}
                      placeholder="Job Title"
                      className="font-medium"
                    />
                  ) : (
                    exp.jobTitle
                  )}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">
                  {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                </div>
              </div>
              
              <div className="text-gray-600">
                {isEditing ? (
                  <Input
                    value={exp.companyName}
                    onChange={(e) => onUpdate?.(index, "companyName", e.target.value)}
                    placeholder="Company Name"
                  />
                ) : (
                  exp.companyName
                )}
              </div>
              
              <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex}>
                    {isEditing ? (
                      <Textarea
                        value={resp}
                        onChange={(e) => {
                          const newResp = [...exp.responsibilities];
                          newResp[respIndex] = e.target.value;
                          onUpdate?.(index, "responsibilities", newResp);
                        }}
                        placeholder="Add responsibility"
                        className="min-h-[2.5rem] text-sm"
                      />
                    ) : (
                      resp
                    )}
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
