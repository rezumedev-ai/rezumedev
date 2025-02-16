
import { ResumeTemplate } from "../templates";
import { Input } from "@/components/ui/input";

interface SkillsSectionProps {
  hardSkills: string[];
  softSkills: string[];
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (type: "hard" | "soft", skills: string[]) => void;
}

export function SkillsSection({ 
  hardSkills, 
  softSkills, 
  template,
  isEditing,
  onUpdate 
}: SkillsSectionProps) {
  if (hardSkills.length === 0 && softSkills.length === 0) return null;

  const renderEditableSkills = (skills: string[], type: "hard" | "soft") => {
    if (!isEditing) return skills.join(", ");

    return (
      <Input
        value={skills.join(", ")}
        onChange={(e) => {
          const newSkills = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
          onUpdate?.(type, newSkills);
        }}
        className="w-full"
        placeholder="Separate skills with commas"
      />
    );
  };

  return (
    <div>
      <h3 className={template.style.sectionStyle}>
        Skills
      </h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {hardSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Technical Skills</h4>
            <div className="text-gray-600">
              {renderEditableSkills(hardSkills, "hard")}
            </div>
          </div>
        )}
        {softSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Soft Skills</h4>
            <div className="text-gray-600">
              {renderEditableSkills(softSkills, "soft")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
