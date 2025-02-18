
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
    if (!isEditing) return skills.join(" • ");

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
    <div className="mb-6">
      <h3 className="text-base font-bold text-black uppercase tracking-wider mb-4 border-b border-black pb-1">
        Technical Skills
      </h3>
      <div className="space-y-4">
        {hardSkills.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-2">Core Competencies</h4>
            <div className="text-sm leading-relaxed">
              {renderEditableSkills(hardSkills, "hard")}
            </div>
          </div>
        )}
        {softSkills.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-2">Professional Skills</h4>
            <div className="text-sm leading-relaxed">
              {renderEditableSkills(softSkills, "soft")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
