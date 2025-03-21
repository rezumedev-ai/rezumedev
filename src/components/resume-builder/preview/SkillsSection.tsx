
import { ResumeTemplate } from "../templates";
import { useMemo } from "react";
import { SectionHeader } from "./SectionHeader";

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
    
    if (template.id === "modern-split" || template.id === "modern-professional") {
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
      title: "text-xs uppercase tracking-[0.2em] text-black mb-6 font-bold text-center",
      skillType: `${dynamicFontSizes.titleFontSize} font-bold text-black mb-3`,
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
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const usesBulletPoints = template.id === "modern-split" || template.id === "professional-executive" || template.id === "minimal-elegant" || template.id === "modern-professional";

  // Modern Professional template
  if (template.id === "modern-professional") {
    return (
      <div className={currentStyle.section}>
        <SectionHeader title="Skills" type="skills" template={template} />
        
        <div className="space-y-4 mt-3">
          {hardSkills.length > 0 && (
            <div>
              <h4 className={currentStyle.skillType}>Technical Skills</h4>
              <ul className="space-y-1.5 mt-2">
                {hardSkills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <span className="inline-flex items-center justify-center w-3 h-3 text-emerald-600 mr-2 shrink-0">
                      ➤
                    </span>
                    <span
                      className={`outline-none ${currentStyle.skillList} flex-1`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {softSkills.length > 0 && (
            <div>
              <h4 className={currentStyle.skillType}>Soft Skills</h4>
              <ul className="space-y-1.5 mt-2">
                {softSkills.map((skill, index) => (
                  <li key={index} className="flex items-center">
                    <span className="inline-flex items-center justify-center w-3 h-3 text-emerald-600 mr-2 shrink-0">
                      ➤
                    </span>
                    <span
                      className={`outline-none ${currentStyle.skillList} flex-1`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
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
                  <li key={index} className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-1.5 h-1.5 rounded-full ${template.id === "modern-split" ? "bg-indigo-400" : "bg-black"} mr-2 shrink-0`}></span>
                    <span
                      className={`outline-none ${currentStyle.skillList} flex-1`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
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
                  <li key={index} className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-1.5 h-1.5 rounded-full ${template.id === "modern-split" ? "bg-indigo-400" : "bg-black"} mr-2 shrink-0`}></span>
                    <span
                      className={`outline-none ${currentStyle.skillList} flex-1`}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                    >
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
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
