
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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
  const handleResponsibilityUpdate = (
    expIndex: number,
    respIndex: number,
    value: string
  ) => {
    const newResponsibilities = [...experiences[expIndex].responsibilities];
    newResponsibilities[respIndex] = value;
    onUpdate?.(expIndex, "responsibilities", newResponsibilities);
  };

  const handleAddResponsibility = (expIndex: number) => {
    const newResponsibilities = [...experiences[expIndex].responsibilities, ""];
    onUpdate?.(expIndex, "responsibilities", newResponsibilities);
  };

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    const newResponsibilities = experiences[expIndex].responsibilities.filter(
      (_, i) => i !== respIndex
    );
    onUpdate?.(expIndex, "responsibilities", newResponsibilities);
  };

  return (
    <div className="mb-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-black uppercase tracking-wider border-b border-black pb-1">
          Professional Experience
        </h3>
        {isEditing && (
          <Button
            onClick={onAdd}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Experience
          </Button>
        )}
      </div>
      <div className="space-y-5">
        {experiences.map((exp, index) => (
          <div key={index} className="relative mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:shadow-md">
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
                onClick={() => onRemove?.(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={exp.jobTitle}
                      onChange={(e) => onUpdate?.(index, "jobTitle", e.target.value)}
                      placeholder="Job Title"
                      className="w-full text-sm font-medium"
                    />
                  ) : (
                    <div className="text-sm font-medium">{exp.jobTitle}</div>
                  )}
                </div>
                <div className="flex gap-2 items-center text-xs whitespace-nowrap">
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => onUpdate?.(index, "startDate", e.target.value)}
                    className={`w-32 ${!isEditing ? 'border-none bg-transparent p-0' : ''}`}
                    disabled={!isEditing}
                  />
                  <span>-</span>
                  {exp.isCurrentJob ? (
                    <span className="w-32 text-center">Present</span>
                  ) : (
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => onUpdate?.(index, "endDate", e.target.value)}
                      className={`w-32 ${!isEditing ? 'border-none bg-transparent p-0' : ''}`}
                      disabled={!isEditing || exp.isCurrentJob}
                    />
                  )}
                </div>
              </div>
              <div className="text-sm">
                {isEditing ? (
                  <Input
                    value={exp.companyName}
                    onChange={(e) => onUpdate?.(index, "companyName", e.target.value)}
                    placeholder="Company Name"
                    className="w-full text-sm font-semibold"
                  />
                ) : (
                  <div className="font-semibold">{exp.companyName}</div>
                )}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-job-${index}`}
                    checked={exp.isCurrentJob}
                    onChange={(e) => onUpdate?.(index, "isCurrentJob", e.target.checked ? "true" : "false")}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`current-job-${index}`} className="text-sm text-gray-600">
                    I currently work here
                  </label>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Responsibilities</div>
                  {isEditing && (
                    <Button
                      onClick={() => handleAddResponsibility(index)}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <ul className="list-disc ml-4 text-sm space-y-2">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex} className="text-sm group">
                      {isEditing ? (
                        <div className="flex gap-2 items-start">
                          <Textarea
                            value={resp}
                            onChange={(e) => handleResponsibilityUpdate(index, respIndex, e.target.value)}
                            placeholder="Add responsibility"
                            className="flex-1 min-h-[40px] text-sm p-2"
                          />
                          {exp.responsibilities.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              onClick={() => handleRemoveResponsibility(index, respIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="leading-relaxed">{resp}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
