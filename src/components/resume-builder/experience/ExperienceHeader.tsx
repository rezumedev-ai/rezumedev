
import { Button } from "@/components/ui/button";
import { Trash2, Briefcase } from "lucide-react";

interface ExperienceHeaderProps {
  index: number;
  onRemove: () => void;
}

export function ExperienceHeader({ index, onRemove }: ExperienceHeaderProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-2 text-primary">
        <Briefcase className="w-5 h-5" />
        <h3 className="font-medium">Experience {index + 1}</h3>
      </div>
    </>
  );
}
