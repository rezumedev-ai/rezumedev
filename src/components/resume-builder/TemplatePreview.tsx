
import { ResumeTemplate } from "./templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplatePreviewProps {
  template: ResumeTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

export function TemplatePreview({ template, isSelected, onSelect }: TemplatePreviewProps) {
  // Add error handling for image loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Failed to load template image:", template.imageUrl);
    e.currentTarget.src = "/placeholder.svg"; // Fallback to placeholder
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden",
        "hover:shadow-xl transform hover:-translate-y-1",
        isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:ring-1 hover:ring-black/50"
      )}
    >
      <div className="aspect-[8.5/11] relative bg-white">
        <img
          src={template.imageUrl}
          alt={`${template.name} Resume Template`}
          className="object-contain w-full h-full"
          onError={handleImageError}
        />
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
            <Check className="w-4 h-4" />
          </div>
        )}
        
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent",
          "opacity-0 hover:opacity-100 transition-opacity duration-300"
        )}>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-gray-200">{template.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
