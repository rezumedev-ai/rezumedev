
import { ResumeTemplate } from "../../../templates";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TemplateImageProps {
  template: ResumeTemplate;
  isSelected: boolean;
  isHovered: boolean;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function TemplateImage({ template, isSelected, isHovered, onImageError }: TemplateImageProps) {
  return (
    <div className="bg-white">
      <AspectRatio ratio={8.5/11} className="relative">
        <img
          src={template.imageUrl}
          alt={`${template.name} Resume Template`}
          className="w-full h-full object-contain"
          onError={onImageError}
        />
        
        {isSelected && (
          <motion.div 
            className="absolute inset-0 bg-primary/10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Check className="w-4 h-4" />
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
        
        <div className="absolute top-2 left-2">
          <Badge 
            variant="primary" 
            size="sm"
            icon={<Sparkles className="w-3 h-3 text-primary" />}
          >
            Premium
          </Badge>
        </div>
      </AspectRatio>
    </div>
  );
}
