
import { motion } from "framer-motion";
import { PricingFeature } from "../PricingFeature";
import { SubscriptionButton } from "../SubscriptionButton";
import { PlanType } from "@/hooks/use-pricing";

interface FreePlanProps {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export const FreePlan = ({ hasActiveSubscription, currentPlan }: FreePlanProps) => {
  return (
    <motion.div 
      className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-gray-500/20 to-gray-600/20 opacity-80 rounded-full"></div>
      
      <div className="mb-4">
        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
          Free Plan
        </span>
        <h3 className="text-xl font-semibold text-secondary">Free</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">$0</span>
          <span className="text-muted-foreground">/forever</span>
        </div>
        <p className="text-sm mt-2 text-muted-foreground">Perfect for trying out our AI resume builder</p>
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
        <PricingFeature text="Create one resume" />
        <PricingFeature text="Basic templates" />
        <PricingFeature text="PDF export" />
        <PricingFeature text="Community support" />
      </motion.ul>
      
      <SubscriptionButton 
        planType="free"
        hasActiveSubscription={!!hasActiveSubscription}
        currentPlan={currentPlan}
      />
    </motion.div>
  );
};

