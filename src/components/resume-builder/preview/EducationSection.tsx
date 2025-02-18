
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
}

export function EducationSection({ 
  education, 
  template,
  isEditing,
  onUpdate 
}: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
        Education
      </h3>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-baseline gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={edu.degreeName}
                      onChange={(e) => onUpdate?.(index, "degreeName", e.target.value)}
                      placeholder="Degree Name"
                      className="font-bold text-sm"
                    />
                  ) : (
                    <h4 className="font-bold text-sm">{edu.degreeName}</h4>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => onUpdate?.(index, "startDate", e.target.value)}
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
                      onChange={(e) => onUpdate?.(index, "endDate", e.target.value)}
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
                    onChange={(e) => onUpdate?.(index, "schoolName", e.target.value)}
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
                    onChange={(e) => onUpdate?.(index, "isCurrentlyEnrolled", e.target.checked ? "true" : "false")}
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
