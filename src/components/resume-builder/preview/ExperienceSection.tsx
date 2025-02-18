
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

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
  const renderEditableText = (
    text: string, 
    index: number, 
    field: keyof WorkExperience,
    placeholder: string,
    isTextarea?: boolean
  ) => {
    if (!isEditing) return text;

    const Component = isTextarea ? Textarea : Input;
    return (
      <Component
        value={text}
        onChange={(e) => onUpdate?.(index, field, e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm"
      />
    );
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
                  {renderEditableText(exp.jobTitle, index, "jobTitle", "Job Title")}
                </div>
                <div className="flex gap-2 items-center text-xs">
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
              <div className="text-sm font-semibold">
                {renderEditableText(exp.companyName, index, "companyName", "Company Name")}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-job-${index}`}
                    checked={exp.isCurrentJob}
                    onChange={(e) => {
                      onUpdate?.(index, "isCurrentJob", e.target.checked ? "true" : "false");
                      if (e.target.checked) {
                        onUpdate?.(index, "endDate", "");
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`current-job-${index}`} className="text-sm text-gray-600">
                    I currently work here
                  </label>
                </div>
              )}
              <ul className="list-disc ml-4 text-sm space-y-2">
                {exp.responsibilities.map((resp, respIndex) => (
                  <li key={respIndex} className="text-sm group">
                    {isEditing ? (
                      <div className="flex gap-2 items-start">
                        <Textarea
                          value={resp}
                          onChange={(e) => {
                            const newResp = [...exp.responsibilities];
                            newResp[respIndex] = e.target.value;
                            onUpdate?.(index, "responsibilities", newResp);
                          }}
                          placeholder="Add responsibility"
                          className="flex-1 min-h-[40px] text-sm p-2"
                          style={{
                            resize: 'none',
                            overflow: 'hidden',
                            height: 'auto',
                            minHeight: '40px',
                            maxHeight: '120px'
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => {
                            const newResp = exp.responsibilities.filter((_, i) => i !== respIndex);
                            onUpdate?.(index, "responsibilities", newResp);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="leading-relaxed">{resp}</span>
                    )}
                  </li>
                ))}
                {isEditing && (
                  <li>
                    <Button
                      onClick={() => {
                        const newResp = [...exp.responsibilities, ""];
                        onUpdate?.(index, "responsibilities", newResp);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-2 text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Responsibility
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
