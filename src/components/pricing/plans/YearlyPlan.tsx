
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { PricingFeature } from "../PricingFeature";
import { SubscriptionButton } from "../SubscriptionButton";
import { PlanType } from "@/hooks/use-pricing";

interface YearlyPlanProps {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export const YearlyPlan = ({ hasActiveSubscription, currentPlan }: YearlyPlanProps) => {
  return (
    <motion.div 
      className={`relative border-2 ${hasActiveSubscription && currentPlan === 'yearly' ? 'border-green-500' : 'border-primary'} rounded-2xl p-8 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform md:scale-105 z-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 animate-pulse rounded-2xl"></div>
      
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow-lg">
        <span className="text-sm font-medium text-white flex items-center">
          <Star className="w-3 h-3 mr-1 animate-pulse" />
          Most Popular
        </span>
      </div>
      
      <div className="mb-4">
        <span className="inline-block bg-primary/80 text-white px-3 py-1 text-xs font-medium rounded-full mb-2">
          Yearly Plan
        </span>
        <h3 className="text-xl font-semibold text-secondary">Yearly</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">$7.49</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <p className="text-sm mt-2 text-muted-foreground">Billed annually ($89.88/year)</p>
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
              delayChildren: 0.3
            }
          }
        }}
      >
        <PricingFeature text="Everything in Monthly" highlight={true} />
        <PricingFeature text="Save 25% annually" highlight={true} />
        <PricingFeature text="Priority support" highlight={true} />
        <PricingFeature text="Early access to new features" highlight={true} />
      </motion.ul>
      
      <SubscriptionButton 
        planType="yearly"
        hasActiveSubscription={!!hasActiveSubscription}
        currentPlan={currentPlan}
      />
    </motion.div>
  );
};

