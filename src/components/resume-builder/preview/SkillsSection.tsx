import { ResumeTemplate } from "../templates";
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
  if (!hardSkills.length && !softSkills.length) return null;

  const styles = {
    "executive-clean": {
      section: "mb-6",
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300",
      skillsContainer: "space-y-2"
    },
    "modern-split": {
      section: "mb-4",
      title: "text-[13px] font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center",
      skillsContainer: "grid grid-cols-2 gap-2"
    },
    "minimal-elegant": {
      section: "mb-5",
      title: "text-[15px] font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200",
      skillsContainer: "grid grid-cols-2 gap-4"
    },
    "professional-executive": {
      section: "mb-5",
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black",
      skillsContainer: "grid grid-cols-2 gap-4"
    },
    "modern-professional": {
      section: "mb-5",
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3",
      skillsContainer: "grid grid-cols-2 gap-4"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  if (template.id === "modern-professional") {
    return (
      <div>
        {/* Conditionally render SectionHeader only if icons are enabled */}
        {template.style.icons.sections ? (
          <SectionHeader title="Skills" type="skills" template={template} />
        ) : (
          <h3 className={currentStyle.title}>Skills</h3>
        )}
        <div className={currentStyle.skillsContainer}>
          {hardSkills.length > 0 && (
            <div>
              <h4 className="font-semibold text-[10px] mb-1">Technical Skills</h4>
              <div className="text-[10px] text-gray-600 leading-tight">
                {hardSkills.join(", ")}
              </div>
            </div>
          )}
          {softSkills.length > 0 && (
            <div>
              <h4 className="font-semibold text-[10px] mb-1">Soft Skills</h4>
              <div className="text-[10px] text-gray-600 leading-tight">
                {softSkills.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderSkills = (skills: string[], type: "hard" | "soft") => {
    if (!isEditing || !onUpdate) {
      return (
        <div className="text-gray-700">
          {skills.join(", ")}
        </div>
      );
    }

    const handleSkillChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newSkills = [...skills];
      newSkills[index] = event.target.value;
      onUpdate(type, newSkills);
    };

    const handleAddSkill = () => {
      onUpdate(type, [...skills, ""]);
    };

    const handleRemoveSkill = (index: number) => {
      const newSkills = [...skills];
      newSkills.splice(index, 1);
      onUpdate(type, newSkills);
    };

    return (
      <div>
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center mb-1">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(e, index)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemoveSkill(index)}
              className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Add Skill
        </button>
      </div>
    );
  };

  return (
    <div className={currentStyle.section}>
      <SectionHeader title="Skills" type="skills" template={template} />
      <div className={currentStyle.skillsContainer}>
        <div>
          <h4 className="font-semibold">Technical Skills</h4>
          {renderSkills(hardSkills, "hard")}
        </div>
        <div>
          <h4 className="font-semibold">Soft Skills</h4>
          {renderSkills(softSkills, "soft")}
        </div>
      </div>
    </div>
  );
}
