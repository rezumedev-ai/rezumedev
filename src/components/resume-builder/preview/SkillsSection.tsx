
import { ResumeTemplate } from "../templates";

interface SkillsSectionProps {
  hardSkills: string[];
  softSkills: string[];
  template: ResumeTemplate;
}

export function SkillsSection({ hardSkills, softSkills, template }: SkillsSectionProps) {
  if (hardSkills.length === 0 && softSkills.length === 0) return null;

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
              {hardSkills.join(", ")}
            </div>
          </div>
        )}
        {softSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Soft Skills</h4>
            <div className="text-gray-600">
              {softSkills.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
