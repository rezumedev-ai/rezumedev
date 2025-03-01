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

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      skillType: "font-bold text-sm text-gray-700 mb-2",
      skillList: "text-sm text-gray-700"
    },
    "modern-split": {
      section: "mb-2",
      title: "text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mb-1",
      skillType: "text-[10px] font-medium text-gray-700 mb-0.5",
      skillList: "text-[10px] text-gray-600"
    },
    "minimal-elegant": {
      section: "mb-10",
      title: "text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-medium text-center",
      skillType: "text-xs font-medium text-gray-500 mb-3",
      skillList: "text-[13px] text-gray-600"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      skillType: "font-medium text-[13px] mb-1",
      skillList: "text-[13px] text-gray-700"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  const usesBulletPoints = template.id === "modern-split" || template.id === "professional-executive";

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-3 h-[1px] bg-indigo-500 mr-1"></span>
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
      <div className="space-y-2">
        {hardSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Core Competencies" : 
               template.id === "minimal-elegant" ? "Technical Skills" : "Technical Skills"}
            </h4>
            
            {usesBulletPoints ? (
              <ul className={template.id === "modern-split" ? "space-y-0" : "space-y-1"}>
                {hardSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-1 h-1 rounded-full ${template.id === "modern-split" ? "bg-indigo-400" : "bg-black"} mt-[5px] mr-1 shrink-0`}></span>
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
                    className={`text-[13px] px-3 py-1 bg-gray-50 rounded-full outline-none`}
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
              <ul className={template.id === "modern-split" ? "space-y-0.5" : "space-y-1"}>
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
                    className={`text-[13px] px-3 py-1 bg-gray-50 rounded-full outline-none`}
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
