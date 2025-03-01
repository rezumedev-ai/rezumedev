
import { ResumeTemplate } from "../templates";
import { useMemo } from "react";

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
    
    if (template.id === "modern-split") {
      newSkills = Array.from(event.target.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
    } else {
      newSkills = event.target.innerText
        .split("•")
        .map(s => s.trim())
        .filter(Boolean);
    }
    
    onUpdate(type, newSkills);
  };

  // Calculate dynamic font sizes based on content length
  const dynamicFontSizes = useMemo(() => {
    const totalHardSkills = hardSkills.length;
    const totalSoftSkills = softSkills.length;
    const totalSkills = totalHardSkills + totalSoftSkills;
    
    // Base font size
    let skillsFontSize = "text-sm";
    let titleFontSize = "text-sm";
    
    // Adjust based on total skills count
    if (totalSkills > 12) {
      skillsFontSize = "text-xs";
      titleFontSize = "text-xs";
    } else if (totalSkills > 8) {
      skillsFontSize = "text-[13px]";
      titleFontSize = "text-[13px]";
    } else if (totalSkills <= 4) {
      skillsFontSize = "text-sm";
      titleFontSize = "text-sm";
    }
    
    // Check for long skill names
    const hasLongSkillNames = [...hardSkills, ...softSkills].some(skill => skill.length > 25);
    if (hasLongSkillNames) {
      skillsFontSize = totalSkills > 8 ? "text-xs" : "text-[13px]";
    }
    
    return { skillsFontSize, titleFontSize };
  }, [hardSkills, softSkills]);

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      skillType: `font-bold ${dynamicFontSizes.titleFontSize} text-gray-700 mb-2`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    },
    "modern-split": {
      section: "mb-6",
      title: "text-[13px] font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-700 mb-2`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-600`
    },
    "minimal-elegant": {
      section: "mb-10",
      title: "text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-medium text-center",
      skillType: `${dynamicFontSizes.titleFontSize} font-medium text-gray-500 mb-3`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-600`
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      skillType: `font-medium ${dynamicFontSizes.titleFontSize} mb-1`,
      skillList: `${dynamicFontSizes.skillsFontSize} text-gray-700`
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const usesBulletPoints = template.id === "modern-split" || template.id === "professional-executive";

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-indigo-500 mr-2"></span>
            Skills
          </span>
        ) : template.id === "professional-executive" ? (
          "Technical Skills"
        ) : template.id === "minimal-elegant" ? (
          "Skills"
        ) : (
          "Skills"
        )}
      </h3>
      <div className="space-y-3">
        {hardSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Core Competencies" : 
               template.id === "minimal-elegant" ? "Technical Skills" : "Technical"}
            </h4>
            
            {usesBulletPoints ? (
              <ul className={template.id === "modern-split" ? "space-y-1" : "space-y-1"}>
                {hardSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${template.id === "modern-split" ? "bg-indigo-400" : "bg-black"} mt-[6px] mr-2 shrink-0`}></span>
                    <span
                      className={`outline-none ${currentStyle.skillList}`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            ) : template.id === "minimal-elegant" ? (
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {hardSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className={`${dynamicFontSizes.skillsFontSize} px-3 py-1 bg-gray-50 rounded-full outline-none`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div 
                className={`${currentStyle.skillList} outline-none`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleSkillsEdit("hard", e)}
              >
                {hardSkills.join(" • ")}
              </div>
            )}
          </div>
        )}
        
        {softSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Professional Skills" : 
               template.id === "minimal-elegant" ? "Professional Skills" : "Soft Skills"}
            </h4>
            
            {usesBulletPoints ? (
              <ul className={template.id === "modern-split" ? "space-y-1" : "space-y-1"}>
                {softSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${template.id === "modern-split" ? "bg-indigo-400" : "bg-black"} mt-[6px] mr-2 shrink-0`}></span>
                    <span
                      className={`outline-none ${currentStyle.skillList}`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            ) : template.id === "minimal-elegant" ? (
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {softSkills.map((skill, index) => (
                  <span 
                    key={index}
                    className={`${dynamicFontSizes.skillsFontSize} px-3 py-1 bg-gray-50 rounded-full outline-none`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div 
                className={`${currentStyle.skillList} outline-none`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleSkillsEdit("soft", e)}
              >
                {softSkills.join(" • ")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
