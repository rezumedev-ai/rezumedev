
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Briefcase, Trophy } from "lucide-react";

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
            Add Experience
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
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
            
            <div className="space-y-3">
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
                  <>
                    <Input
                      value={exp.companyName}
                      onChange={(e) => onUpdate?.(index, "companyName", e.target.value)}
                      placeholder="Company Name"
                      className="mb-2"
                    />
                    <Input
                      value={exp.location}
                      onChange={(e) => onUpdate?.(index, "location", e.target.value)}
                      placeholder="Location (Optional)"
                    />
                  </>
                ) : (
                  <div className="space-y-1">
                    <div>{exp.companyName}</div>
                    {exp.location && <div className="text-sm">{exp.location}</div>}
                  </div>
                )}
              </div>
              
              {/* Key Responsibilities */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium">Key Responsibilities</h4>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newResponsibilities = [...exp.responsibilities, ""];
                        onUpdate?.(index, "responsibilities", newResponsibilities);
                      }}
                      className="h-6 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex} className="text-sm">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Textarea
                            value={resp}
                            onChange={(e) => {
                              const newResp = [...exp.responsibilities];
                              newResp[respIndex] = e.target.value;
                              onUpdate?.(index, "responsibilities", newResp);
                            }}
                            placeholder="Add responsibility"
                            className="flex-1 min-h-[2.5rem] text-sm"
                          />
                          {exp.responsibilities.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newResp = exp.responsibilities.filter((_, i) => i !== respIndex);
                                onUpdate?.(index, "responsibilities", newResp);
                              }}
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ) : (
                        resp
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Achievements */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Key Achievements
                  </h4>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newAchievements = [...(exp.achievements || []), ""];
                        onUpdate?.(index, "achievements", newAchievements);
                      }}
                      className="h-6 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                {(exp.achievements?.length ?? 0) > 0 && (
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    {exp.achievements?.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="text-sm">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Textarea
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...(exp.achievements || [])];
                                newAchievements[achievementIndex] = e.target.value;
                                onUpdate?.(index, "achievements", newAchievements);
                              }}
                              placeholder="Add achievement"
                              className="flex-1 min-h-[2.5rem] text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newAchievements = exp.achievements?.filter((_, i) => i !== achievementIndex) || [];
                                onUpdate?.(index, "achievements", newAchievements);
                              }}
                              className="h-6 w-6 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          achievement
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
