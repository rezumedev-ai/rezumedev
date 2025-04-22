
import { ResumeTemplate } from "../templates";
import { motion } from "framer-motion";
import { useState } from "react";
import { TemplateItem } from "./template-selection/TemplateItem";

interface TemplateSelectionGridProps {
  templates: ResumeTemplate[];
  currentTemplateId: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelectionGrid({
  templates,
  currentTemplateId,
  onTemplateChange
}: TemplateSelectionGridProps) {
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg max-h-[80vh] overflow-y-auto">
      <div className="text-center mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Choose a Template</h3>
        <p className="text-sm sm:text-base text-gray-600">
          Select from our professional templates to showcase your experience
        </p>
      </div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {templates.map((template) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <TemplateItem 
              template={template}
              isSelected={currentTemplateId === template.id}
              isHovered={hoveredTemplateId === template.id}
              onSelect={() => onTemplateChange(template.id)}
              onHover={() => setHoveredTemplateId(template.id)}
              onLeave={() => setHoveredTemplateId(null)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
