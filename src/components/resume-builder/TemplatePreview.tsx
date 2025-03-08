
import { ResumeTemplate } from "./templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      onClick={onSelect}
      className={cn(
        "relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden h-full flex flex-col",
        "hover:shadow-xl transform",
        isSelected ? 
          "ring-2 ring-primary shadow-lg scale-[1.02] bg-accent/30" : 
          "hover:ring-1 hover:ring-black/50 bg-white"
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-[8.5/11] relative bg-white flex-grow">
        <img
          src={template.imageUrl}
          alt={`${template.name} Resume Template`}
          className="object-contain w-full h-full"
          onError={handleImageError}
        />
        
        {isSelected && (
          <motion.div 
            className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className={cn(
          "p-4 border-t border-gray-100",
          isSelected ? "bg-accent/40" : "bg-white"
        )}
      >
        <h3 className="font-medium text-base">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      </motion.div>
    </motion.div>
  );
}
