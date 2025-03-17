
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Plus, Lock } from "lucide-react";

interface EmptyResumeCardProps {
  onClick: () => void;
  canCreateMoreResumes: boolean;
}

export function EmptyResumeCard({ onClick, canCreateMoreResumes }: EmptyResumeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className="h-full group p-6 border-dashed hover:border-primary/50 transition-all duration-500 cursor-pointer bg-white/50 backdrop-blur-sm"
        onClick={onClick}
      >
        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-6">
          <motion.div 
            className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center"
            whileHover={{ 
              scale: 1.1, 
              backgroundColor: "rgba(99, 102, 241, 0.1)" 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {canCreateMoreResumes ? (
              <Plus className="w-8 h-8 text-primary/60" />
            ) : (
              <Lock className="w-8 h-8 text-primary/60" />
            )}
          </motion.div>
          <div className="text-center space-y-1">
            <p className="font-medium text-lg">Create New Resume</p>
            {!canCreateMoreResumes && (
              <p className="text-xs text-amber-600">Subscription required for multiple resumes</p>
            )}
            <p className="text-sm text-gray-500">Start building your professional story</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
