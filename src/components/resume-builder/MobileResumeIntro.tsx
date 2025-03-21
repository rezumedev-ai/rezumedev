
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        height: "100dvh", // Using dvh for dynamic viewport height
        width: "100%",
        margin: 0,
        padding: 0,
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "hidden",
        overflowX: "hidden"
      }}
    >
      <motion.div 
        className="flex flex-col items-center text-center px-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ 
          maxWidth: "280px",
          width: "90%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="relative mb-3">
          <motion.div
            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
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
            <Smartphone className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
          </motion.div>
        </div>

        <div className="space-y-2 mb-3">
          <motion.h2 
            className="text-base font-bold text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Optimized for Mobile
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-primary font-medium">{resumeName}</span> looks best when you pinch to zoom out to view the complete document
          </motion.p>

          <motion.div
            className="flex items-center justify-center mt-2 space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-1 h-1 rounded-full bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            <div className="w-3 h-3 rounded-full bg-primary/70"></div>
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Eye className="h-2.5 w-2.5 text-white" />
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
            className="w-full group"
            size="sm"
          >
            View Resume
            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="text-xs text-gray-500 mt-1">
            Continuing automatically in a few seconds...
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
