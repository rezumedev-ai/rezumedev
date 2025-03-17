
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ResumeListHeaderProps {
  onCreateNew: () => void;
}

export function ResumeListHeader({ onCreateNew }: ResumeListHeaderProps) {
  return (
    <motion.div 
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 24
      }}
    >
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Resumes</span>
        </h2>
        <p className="text-sm md:text-base text-gray-600">Craft your professional story with our intelligent resume builder</p>
      </div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button 
          onClick={onCreateNew} 
          className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/25 w-full sm:w-auto group"
        >
          <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
          Create New Resume
        </Button>
      </motion.div>
    </motion.div>
  );
}
