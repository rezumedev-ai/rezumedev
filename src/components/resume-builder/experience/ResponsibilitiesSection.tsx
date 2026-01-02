
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResponsibilityInput } from "./ResponsibilityInput";

export interface ResponsibilitiesSectionProps {
  responsibilities: string[];
  onUpdate: (value: string[]) => void;
  jobTitle: string;
}

export function ResponsibilitiesSection({
  responsibilities,
  onUpdate,
  jobTitle
}: ResponsibilitiesSectionProps) {
  const handleAddResponsibility = () => {
    onUpdate([...responsibilities, ""]);
  };

  const handleRemoveResponsibility = (index: number) => {
    const updated = responsibilities.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleChangeResponsibility = (index: number, value: string) => {
    const updated = [...responsibilities];
    updated[index] = value;
    onUpdate(updated);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">
          Key Responsibilities & Achievements
        </h4>
        <Button
          type="button"
          onClick={handleAddResponsibility}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {responsibilities.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Add responsibilities or achievements for {jobTitle || "this position"}
        </p>
      ) : (
        <div>
          {responsibilities.map((responsibility, index) => (
            <ResponsibilityInput
              key={index}
              value={responsibility}
              index={index}
              jobTitle={jobTitle}
              onChange={handleChangeResponsibility}
              onRemove={handleRemoveResponsibility}
            />
          ))}
        </div>
      )}
    </div>
  );
}
