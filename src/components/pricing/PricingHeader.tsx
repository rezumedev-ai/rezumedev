
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface PricingHeaderProps {
  hasActiveSubscription: boolean;
  currentPlan?: string;
}

export function PricingHeader({ hasActiveSubscription, currentPlan }: PricingHeaderProps) {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
        Plans for Every Career Stage
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
        <span className="text-black">Invest</span>{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          in Your Future
        </span>
        <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
      </h1>
      
      <motion.p 
        className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {hasActiveSubscription 
          ? "You're currently on the " + currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1) + " plan. You can switch plans anytime."
          : "Choose the plan that works best for you. All plans include our core AI-powered resume features."}
      </motion.p>
    </motion.div>
  );
}
