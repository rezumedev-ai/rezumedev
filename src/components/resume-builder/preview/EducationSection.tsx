
import { Education } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface EducationSectionProps {
  education: Education[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (index: number, field: keyof Education, value: string) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}

export function EducationSection({ 
  education, 
  template,
  isEditing,
  onUpdate,
  onAdd,
  onRemove
}: EducationSectionProps) {
  if (education.length === 0) return null;

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    if (field === "isCurrentlyEnrolled") {
      const isCurrently = value === "true";
      onUpdate?.(index, field, value);
      if (isCurrently) {
        onUpdate?.(index, "endDate", "");
      }
    } else {
      onUpdate?.(index, field, value);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-black uppercase tracking-wider border-b border-black pb-1">
          Education
        </h3>
        {isEditing && (
          <Button
            onClick={onAdd}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Education
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-100">
            {isEditing && onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors duration-200"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-baseline gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={edu.degreeName}
                      onChange={(e) => handleUpdateEducation(index, "degreeName", e.target.value)}
                      placeholder="Degree Name"
                      className="font-bold text-sm"
                    />
                  ) : (
                    <h4 className="font-bold text-sm">{edu.degreeName}</h4>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleUpdateEducation(index, "startDate", e.target.value)}
                    className={`w-32 ${!isEditing ? 'border-none bg-transparent p-0' : ''}`}
                    disabled={!isEditing}
                  />
                  <span>-</span>
                  {edu.isCurrentlyEnrolled ? (
                    <span className="w-32 text-center">Present</span>
                  ) : (
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleUpdateEducation(index, "endDate", e.target.value)}
                      className={`w-32 ${!isEditing ? 'border-none bg-transparent p-0' : ''}`}
                      disabled={!isEditing}
                    />
                  )}
                </div>
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={edu.schoolName}
                    onChange={(e) => handleUpdateEducation(index, "schoolName", e.target.value)}
                    placeholder="School Name"
                    className="text-sm"
                  />
                ) : (
                  <div className="text-sm">{edu.schoolName}</div>
                )}
              </div>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-education-${index}`}
                    checked={edu.isCurrentlyEnrolled}
                    onChange={(e) => handleUpdateEducation(index, "isCurrentlyEnrolled", e.target.checked.toString())}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`current-education-${index}`} className="text-sm text-gray-600">
                    I am currently enrolled here
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
