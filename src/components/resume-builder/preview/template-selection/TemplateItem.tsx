
import { ResumeTemplate } from "../../templates";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl overflow-hidden h-full flex flex-col border transition-all duration-300",
        isSelected 
          ? "border-primary shadow-lg ring-2 ring-primary/30" 
          : "border-gray-200 hover:border-primary/40 hover:shadow-md"
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="bg-white">
        <AspectRatio ratio={8.5/11}>
          <img
            src={template.imageUrl}
            alt={template.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          
          {isSelected && (
            <motion.div 
              className="absolute inset-0 bg-primary/10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="bg-primary text-white rounded-full p-2 sm:p-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              >
                <Check className="w-5 h-5 sm:w-8 sm:h-8" />
              </motion.div>
            </motion.div>
          )}
          
          {(isHovered && !isSelected) && (
            <motion.div 
              className="absolute inset-0 bg-black/5 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="bg-white text-primary rounded-md px-2 py-1 sm:px-4 sm:py-2 shadow-lg font-medium text-xs sm:text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Select This Template
              </motion.div>
            </motion.div>
          )}
          
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-primary">Premium</span>
            </div>
          </div>
        </AspectRatio>
      </div>
      
      <div className={cn(
        "p-2 sm:p-4",
        isSelected ? "bg-primary/5" : "bg-white"
      )}>
        <h4 className="font-medium truncate text-sm sm:text-base">{template.name}</h4>
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-0.5 sm:mt-1">{template.description}</p>
      </div>
    </div>
  );
}
