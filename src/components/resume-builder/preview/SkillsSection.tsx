
import { ResumeTemplate } from "../templates";

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

  const handleSkillsEdit = (type: "hard" | "soft", event: React.FocusEvent<HTMLDivElement>) => {
    if (!isEditing || !onUpdate) return;
    const newSkills = event.target.innerText
      .split("•")
      .map(s => s.trim())
      .filter(Boolean);
    onUpdate(type, newSkills);
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
            <div 
              className="text-sm leading-relaxed outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleSkillsEdit("hard", e)}
            >
              {hardSkills.join(" • ")}
            </div>
          </div>
        )}
        {softSkills.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-2">Professional Skills</h4>
            <div 
              className="text-sm leading-relaxed outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleSkillsEdit("soft", e)}
            >
              {softSkills.join(" • ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
