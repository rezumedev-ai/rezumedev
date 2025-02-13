
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkExperience } from "@/types/resume";
import { ExperienceCard } from "./experience/ExperienceCard";

interface WorkExperienceStepProps {
  formData: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
  hideAiSuggestions?: boolean;
}

export function WorkExperienceStep({ formData, onChange, hideAiSuggestions = false }: WorkExperienceStepProps) {
  const addExperience = () => {
    onChange([
      ...formData,
      {
        jobTitle: "",
        companyName: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrentJob: false,
        responsibilities: [""]
      }
    ]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updatedExperiences = formData.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange(updatedExperiences);
  };

  const removeExperience = (index: number) => {
    onChange(formData.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {formData.map((experience, index) => (
        <ExperienceCard
          key={index}
          experience={experience}
          index={index}
          onUpdate={(field, value) => updateExperience(index, field, value)}
          onRemove={() => removeExperience(index)}
          hideAiSuggestions={hideAiSuggestions}
        />
      ))}

      <Button
        onClick={addExperience}
        variant="outline"
        className="w-full py-8 border-dashed hover:border-primary hover:bg-primary/5"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Work Experience
      </Button>
    </div>
  );
}
