
import { ResumeTemplate } from "../templates";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <div className="p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h3>
        <p className="text-gray-600">
          Select from our professional templates to showcase your experience
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            onMouseEnter={() => setHoveredTemplateId(template.id)}
            onMouseLeave={() => setHoveredTemplateId(null)}
          >
            <div
              className={cn(
                "relative cursor-pointer rounded-xl overflow-hidden h-full flex flex-col border transition-all duration-300",
                currentTemplateId === template.id 
                  ? "border-primary shadow-lg ring-2 ring-primary/30" 
                  : "border-gray-200 hover:border-primary/40 hover:shadow-md"
              )}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="relative aspect-[8.5/11] bg-white">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                
                {currentTemplateId === template.id && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="bg-primary text-white rounded-full p-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                    >
                      <Check className="w-8 h-8" />
                    </motion.div>
                  </motion.div>
                )}
                
                {(hoveredTemplateId === template.id && currentTemplateId !== template.id) && (
                  <motion.div 
                    className="absolute inset-0 bg-black/5 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="bg-white text-primary rounded-md px-4 py-2 shadow-lg font-medium"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Select This Template
                    </motion.div>
                  </motion.div>
                )}
                
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Premium</span>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "p-4",
                currentTemplateId === template.id ? "bg-primary/5" : "bg-white"
              )}>
                <h4 className="font-medium truncate">{template.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{template.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
