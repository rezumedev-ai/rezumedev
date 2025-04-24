
import { ResumeTemplate } from "../../templates";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TemplateImage } from "./components/TemplateImage";
import { TemplateDetails } from "./components/TemplateDetails";

interface TemplateItemProps {
  template: ResumeTemplate;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}

export function TemplateItem({
  template,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave
}: TemplateItemProps) {
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
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <TemplateImage
        template={template}
        isSelected={isSelected}
        isHovered={isHovered}
        onImageError={handleImageError}
      />
      
      <TemplateDetails
        template={template}
        isSelected={isSelected}
      />
    </motion.div>
  );
}
