
import { ResumeTemplate } from "../templates";
import { useMemo } from "react";
import { SectionHeader } from "./SectionHeader";
import { BulletPoint } from "../ui/BulletPoint";

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
    let newSkills: string[] = [];

    if (template.id === "modern-split" || template.id === "modern-professional" || template.id === "professional-navy") {
      newSkills = Array.from(event.target.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
    } else {
      newSkills = event.target.innerText
        .split("•")
        .map(s => s.trim())
        .filter(Boolean);
    }

    onUpdate(type, newSkills);
  };

  // Standardized font sizes based on modern-professional template
  const dynamicFontSizes = useMemo(() => {
    const totalHardSkills = hardSkills.length;
    const totalSoftSkills = softSkills.length;
    const totalSkills = totalHardSkills + totalSoftSkills;

    // Default sizes from modern-professional
    let skillsFontSize = "text-[14px]";
    let titleFontSize = "text-sm";

    // Only adjust down if we have too many skills
    if (totalSkills > 14) {
      skillsFontSize = "text-xs";
      titleFontSize = "text-xs";
    } else if (totalSkills > 10) {
      skillsFontSize = "text-[13px]";
    }

    // Additional check for long skill names
    const hasLongSkillNames = [...hardSkills, ...softSkills].some(skill => skill.length > 20);
    if (hasLongSkillNames && totalSkills > 8) {
      skillsFontSize = "text-xs";
    }

    return { skillsFontSize, titleFontSize };
  }, [hardSkills, softSkills]);

  // Standardized styles based on modern-professional
  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-3",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "modern-split": {
      section: "mb-6",
      title: "text-base font-bold uppercase tracking-wide mb-3 flex items-center",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "minimal-elegant": {
      section: "mb-6",
      title: "text-base font-bold uppercase tracking-wide mb-3",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "professional-executive": {
      section: "mb-6",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "modern-professional": {
      section: "mb-6",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      skillType: `${dynamicFontSizes.titleFontSize} font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "professional-navy": {
      section: "mb-6",
      title: "text-base font-bold text-[#0F2B5B] uppercase tracking-wide mb-3",
      skillType: `${dynamicFontSizes.titleFontSize} font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["modern-professional"];

  // Common rendering pattern for all templates except ones that require special handling
  return (
    <div className={currentStyle.section} data-section="skills">
      <SectionHeader title="Skills" type="skills" template={template} />

      <div className="space-y-4 mt-3">
        {hardSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>Technical Skills</h4>
            <ul className="space-y-1.5 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
              {hardSkills.map((skill, index) => (
                <BulletPoint
                  key={index}
                  template={template.id}
                  className="ml-0 leading-snug"
                  type="skills"
                  data-skill-item="true"
                >
                  {skill}
                </BulletPoint>
              ))}
            </ul>
          </div>
        )}

        {softSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>Soft Skills</h4>
            <ul className="space-y-1.5 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
              {softSkills.map((skill, index) => (
                <BulletPoint
                  key={index}
                  template={template.id}
                  className="ml-0 leading-snug"
                  type="skills"
                  data-skill-item="true"
                >
                  {skill}
                </BulletPoint>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
