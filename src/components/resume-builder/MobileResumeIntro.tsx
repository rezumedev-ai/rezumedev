
import { motion } from "framer-motion";
import { Sparkles, Eye, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface MobileResumeIntroProps {
  onContinue: () => void;
  resumeName?: string;
}

export function MobileResumeIntro({ onContinue, resumeName = "Resume" }: MobileResumeIntroProps) {
  const [autoClose, setAutoClose] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onContinue();
      }, 4000); // Auto continue after 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onContinue]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="max-w-sm w-full flex flex-col items-center text-center space-y-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 0 0px rgba(99, 102, 241, 0.3)",
                "0 0 0 10px rgba(99, 102, 241, 0.0)"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Smartphone className="h-10 w-10 text-primary" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="h-6 w-6 text-amber-400" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h2 
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Optimized for Mobile
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-primary font-medium">{resumeName}</span> looks best when you pinch to zoom out to view the complete document
          </motion.p>

          <motion.div
            className="flex items-center justify-center mt-3 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
            <div className="w-3 h-3 rounded-full bg-primary/50"></div>
            <div className="w-4 h-4 rounded-full bg-primary/70"></div>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full"
        >
          <Button 
            onClick={onContinue} 
            className="w-full mt-4 group"
            size="lg"
          >
            View Resume
            <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="text-xs text-gray-500 mt-3">
            Continuing automatically in a few seconds...
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
