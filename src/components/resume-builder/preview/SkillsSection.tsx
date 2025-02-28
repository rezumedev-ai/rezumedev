
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
      // If using bullet points in modern-split template
      newSkills = Array.from(event.target.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
    } else {
      // For templates using dot separators
      newSkills = event.target.innerText
        .split("•")
        .map(s => s.trim())
        .filter(Boolean);
    }
    
    onUpdate(type, newSkills);
  };

  // Template-specific styles
  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      skillType: "font-bold text-sm text-gray-700 mb-2",
      skillList: "text-sm text-gray-700"
    },
    "modern-split": {
      section: "mb-5",
      title: "text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3",
      skillType: "text-xs font-medium text-gray-700 mb-1",
      skillList: "text-xs text-gray-600"
    },
    "minimal-elegant": {
      section: "mb-6 text-center",
      title: "text-xs font-medium text-gray-400 uppercase tracking-widest mb-4 text-center",
      skillType: "text-xs font-medium text-gray-600 mb-1",
      skillList: "text-sm text-gray-600"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      skillType: "font-medium text-[13px] mb-1",
      skillList: "text-[13px] text-gray-700"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  return (
    <div className={currentStyle.section}>
      <h3 className={currentStyle.title}>
        {template.id === "modern-split" ? (
          <span className="flex items-center">
            <span className="inline-block w-5 h-[2px] bg-indigo-500 mr-2"></span>
            Skills
          </span>
        ) : template.id === "professional-executive" ? (
          "Technical Skills"
        ) : (
          "Skills"
        )}
      </h3>
      <div className="space-y-4">
        {hardSkills.length > 0 && (
          <div>
            <h4 className={currentStyle.skillType}>
              {template.id === "professional-executive" ? "Core Competencies" : "Technical Skills"}
            </h4>
            
            {template.id === "modern-split" ? (
              <ul className="space-y-1">
                {hardSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1 h-1 rounded-full bg-indigo-400 mt-1.5 mr-2"></span>
                    <span
                      className="outline-none text-xs text-gray-600"
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
              {template.id === "professional-executive" ? "Professional Skills" : "Soft Skills"}
            </h4>
            
            {template.id === "modern-split" ? (
              <div 
                className={`${currentStyle.skillList} outline-none`}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleSkillsEdit("soft", e)}
              >
                {softSkills.join(" • ")}
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
