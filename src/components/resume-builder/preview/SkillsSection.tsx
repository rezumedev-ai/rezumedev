
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

  const dynamicFontSizes = useMemo(() => {
    const totalHardSkills = hardSkills.length;
    const totalSoftSkills = softSkills.length;
    const totalSkills = totalHardSkills + totalSoftSkills;
    
    let skillsFontSize = "text-sm";
    let titleFontSize = "text-sm";
    
    if (totalSkills > 12) {
      skillsFontSize = "text-xs";
      titleFontSize = "text-xs";
    } else if (totalSkills > 8) {
      skillsFontSize = "text-[13px]";
      titleFontSize = "text-[13px]";
    } else if (totalSkills <= 4) {
      skillsFontSize = "text-base";
      titleFontSize = "text-base";
    }
    
    const hasLongSkillNames = [...hardSkills, ...softSkills].some(skill => skill.length > 25);
    if (hasLongSkillNames) {
      skillsFontSize = totalSkills > 8 ? "text-xs" : "text-[13px]";
    }
    
    return { skillsFontSize, titleFontSize };
  }, [hardSkills, softSkills]);

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-[20px] font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      skillType: "font-semibold text-sm text-gray-700 mb-2",
      skillList: `${dynamicFontSizes.skillsFontSize} font-medium text-gray-800`
    },
    "modern-split": {
      section: "mb-6",
      title: "text-[13px] font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-600`
    },
    "minimal-elegant": {
      section: "mb-10",
      // Change skillType heading in minimal elegant to mimic other headings style (h3 style)
      title: "text-xs uppercase tracking-[0.2em] text-black mb-6 font-bold text-center",
      skillType: "text-base font-medium text-gray-800 mb-4 border-b border-gray-300 pb-1 text-center",
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      skillType: `font-medium ${dynamicFontSizes.titleFontSize} mb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "modern-professional": {
      section: "mb-6",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      skillType: `font-semibold ${dynamicFontSizes.titleFontSize} text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "professional-navy": {
      section: "mb-6",
      title: "text-base font-bold text-[#0F2B5B] uppercase tracking-wide mb-3",
      skillType: `font-semibold ${dynamicFontSizes.titleFontSize} text-gray-700 mb-2 border-b border-gray-200 pb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  if (template.id === "professional-navy") {
    return (
      <div className={currentStyle.section}>
        <SectionHeader title="Skills" type="skills" template={template} />
        
        <div className="space-y-4 mt-3">
          {hardSkills.length > 0 && (
            <div>
              <h4 className={currentStyle.skillType}>Technical Skills</h4>
              <ul className="space-y-1.5 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
                {hardSkills.map((skill, index) => (
                  <BulletPoint
                    key={index}
                    template="professional-navy"
                    className="ml-0 leading-snug"
                    type="skills"
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
                    template="professional-navy"
                    className="ml-0 leading-snug"
                    type="skills"
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
  
  if (template.id === "modern-professional") {
    return (
      <div className={currentStyle.section}>
        <SectionHeader title="Skills" type="skills" template={template} />
        
        <div className="space-y-4 mt-3">
          {hardSkills.length > 0 && (
            <div>
              <h4 className={currentStyle.skillType}>Technical Skills</h4>
              <ul className="space-y-1.5 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
                {hardSkills.map((skill, index) => (
                  <BulletPoint
                    key={index}
                    template="modern-professional"
                    className="ml-0 leading-snug"
                    type="skills"
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
                    template="modern-professional"
                    className="ml-0 leading-snug"
                    type="skills"
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
  
  return (
    <div
      className={
        template.id === "executive-clean"
          ? `${currentStyle.section} mt-7`
          : currentStyle.section
      }
    >
      <h3 className={currentStyle.title}>
        Skills
      </h3>
      <div className="space-y-3 mt-3">
        {hardSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Core Competencies" : 
               template.id === "minimal-elegant" ? "Technical Skills" : "Technical Skills"}
            </h4>
            <ul className="space-y-1 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
              {hardSkills.map((skill, index) => (
                <BulletPoint
                  key={index}
                  template={template.id}
                  className="ml-0 leading-snug"
                  type="skills"
                >
                  {skill}
                </BulletPoint>
              ))}
            </ul>
          </div>
        )}
        {softSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Professional Skills" : 
               template.id === "minimal-elegant" ? "Professional Skills" : "Soft Skills"}
            </h4>
            <ul className="space-y-1 mt-2 pdf-bullet-list" data-pdf-bullet-list="true">
              {softSkills.map((skill, index) => (
                <BulletPoint
                  key={index}
                  template={template.id}
                  className="ml-0 leading-snug"
                  type="skills"
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
