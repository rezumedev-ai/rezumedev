
import { Card } from "@/components/ui/card";
import { WorkExperience } from "@/types/resume";
import { ResponsibilitiesSection } from "./ResponsibilitiesSection";
import { ExperienceHeader } from "./ExperienceHeader";
import { ExperienceForm } from "./ExperienceForm";

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  onUpdate: (field: keyof WorkExperience, value: any) => void;
  onRemove: () => void;
  hideResponsibilities?: boolean;
}

export function ExperienceCard({ 
  experience, 
  index, 
  onUpdate, 
  onRemove,
  hideResponsibilities = false 
}: ExperienceCardProps) {
  return (
    <Card className="p-6 relative space-y-4 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
      <ExperienceHeader 
        index={index} 
        onRemove={onRemove} 
      />

      <ExperienceForm 
        experience={experience} 
        index={index} 
        onUpdate={onUpdate}
      />

      {!hideResponsibilities && (
        <ResponsibilitiesSection 
          responsibilities={experience.responsibilities} 
          onUpdate={(value) => onUpdate("responsibilities", value)} 
        />
      )}
    </Card>
  );
}
