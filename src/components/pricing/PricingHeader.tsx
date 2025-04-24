
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const PricingHeader = () => {
  return (
    <motion.div 
      className="max-w-2xl mx-auto mb-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
        Plans for Every Career Stage
      </motion.div>
      
      <motion.h2 
        className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="text-black">Invest</span>{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
          in Your Career Success
        </span>
      </motion.h2>
      
      <motion.p 
        className="text-lg text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
      >
        Choose the perfect plan for your career journey. All plans include our core AI-powered resume features.
      </motion.p>
    </motion.div>
  );
};
