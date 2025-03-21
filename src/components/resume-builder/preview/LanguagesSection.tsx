
import { Language } from "@/types/resume";
import { ResumeTemplate } from "../templates";
import { SectionHeader } from "./SectionHeader";

interface LanguagesSectionProps {
  languages: Language[];
  template: ResumeTemplate;
  isEditing: boolean;
  onUpdate?: (index: number, field: keyof Language, value: string) => void;
}

export function LanguagesSection({ languages, template, isEditing, onUpdate }: LanguagesSectionProps) {
  if (!languages || languages.length === 0) return null;

  const handleFieldEdit = (index: number, field: keyof Language, event: React.FocusEvent<HTMLElement>) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(index, field, newValue);
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case "Native":
      case "Fluent":
        return template.id === "professional-navy" ? "bg-[#0F2B5B]" : "bg-emerald-500";
      case "Advanced":
        return template.id === "professional-navy" ? "bg-[#4A6FA5]" : "bg-emerald-400";
      case "Intermediate":
        return template.id === "professional-navy" ? "bg-[#6A8BBF]" : "bg-emerald-300";
      case "Beginner":
        return template.id === "professional-navy" ? "bg-[#8AA7D3]" : "bg-emerald-200";
      default:
        return template.id === "professional-navy" ? "bg-[#8AA7D3]" : "bg-emerald-200";
    }
  };

  return (
    <div className="mt-4">
      <SectionHeader title="Languages" type="languages" template={template} />
      
      <div className="space-y-2 mt-2">
        {languages.map((language, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span 
                className="text-sm font-medium"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleFieldEdit(index, "name", e)}
              >
                {language.name}
              </span>
              <span 
                className="text-xs text-gray-500"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleFieldEdit(index, "proficiency", e)}
              >
                {language.proficiency}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`${getProficiencyColor(language.proficiency)} h-1.5 rounded-full`}
                style={{ 
                  width: language.proficiency === "Native" ? "100%" : 
                         language.proficiency === "Fluent" ? "90%" :
                         language.proficiency === "Advanced" ? "75%" :
                         language.proficiency === "Intermediate" ? "50%" :
                         "25%" 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
