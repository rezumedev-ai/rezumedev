
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { PricingFeature } from "../PricingFeature";
import { SubscriptionButton } from "../SubscriptionButton";
import { PlanType } from "@/hooks/use-pricing";

interface LifetimePlanProps {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export const LifetimePlan = ({ hasActiveSubscription, currentPlan }: LifetimePlanProps) => {
  return (
    <motion.div 
      className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 opacity-80 rounded-full"></div>
      
      {hasActiveSubscription && currentPlan === 'lifetime' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full shadow-lg">
          <span className="text-sm font-medium text-white flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Current Plan
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
          Lifetime Plan
        </span>
        <h3 className="text-xl font-semibold text-secondary">Lifetime</h3>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">$199</span>
          <span className="text-muted-foreground">/one-time</span>
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
              staggerChildren: 0.1,
              delayChildren: 0.6
            }
          }
        }}
      >
        <PricingFeature text="Everything in Yearly" />
        <PricingFeature text="Lifetime updates" />
        <PricingFeature text="VIP support" />
      </motion.ul>
      
      <SubscriptionButton 
        planType="lifetime"
        hasActiveSubscription={!!hasActiveSubscription}
        currentPlan={currentPlan}
      />
    </motion.div>
  );
};

