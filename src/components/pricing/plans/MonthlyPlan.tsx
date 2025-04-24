
import { motion } from "framer-motion";
import { PricingFeature } from "../PricingFeature";
import { SubscriptionButton } from "../SubscriptionButton";
import { PlanType } from "@/hooks/use-pricing";

interface MonthlyPlanProps {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export const MonthlyPlan = ({ hasActiveSubscription, currentPlan }: MonthlyPlanProps) => {
  return (
    <motion.div 
      className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-80 rounded-full"></div>
      
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
          Monthly Plan
        </span>
        <h3 className="text-xl font-semibold text-secondary">Monthly</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">$9.99</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>
      
      <motion.ul 
        className="space-y-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <PricingFeature text="Unlimited resume creations" />
        <PricingFeature text="AI-powered suggestions" />
        <PricingFeature text="Multiple templates" />
        <PricingFeature text="Export to PDF" />
        <PricingFeature text="24/7 support" />
      </motion.ul>
      
      <SubscriptionButton 
        planType="monthly"
        hasActiveSubscription={!!hasActiveSubscription}
        currentPlan={currentPlan}
      />
    </motion.div>
  );
};

