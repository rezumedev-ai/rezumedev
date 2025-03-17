
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { PricingFeatureList } from "./PricingFeatureList";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { PlanType, SubscriptionStatus } from "@/pages/Pricing";
import { CurrentPlanIndicator } from "./CurrentPlanIndicator";
import { PricingPlanBadge } from "./PricingPlanBadge";
import { PricingPopularBadge } from "./PricingPopularBadge";
import { PricingPlanPrice } from "./PricingPlanPrice";

interface PricingPlanProps {
  planType: PlanType;
  title: string;
  price: string;
  period: string;
  badgeText: string;
  badgeColor: string;
  features: string[];
  highlightFeatures?: boolean;
  popularPlan?: boolean;
  subscriptionStatus: SubscriptionStatus;
  animationDelay?: number;
  initialX?: number;
}

export function PricingPlan({ 
  planType, 
  title, 
  price, 
  period, 
  badgeText, 
  badgeColor, 
  features, 
  highlightFeatures = false,
  popularPlan = false,
  subscriptionStatus,
  animationDelay = 0,
  initialX = 0
}: PricingPlanProps) {
  const { hasActiveSubscription, currentPlan } = subscriptionStatus;
  const isCurrentPlan = hasActiveSubscription && currentPlan === planType;
  
  const renderSubscriptionButton = () => {
    if (isCurrentPlan) {
      return <CurrentPlanIndicator />;
    }

    return (
      <CheckoutButton
        planType={planType}
        className={`w-full hover:scale-105 transition-transform ${
          hasActiveSubscription ? "bg-blue-600 hover:bg-blue-700" : ""
        }`}
      >
        {hasActiveSubscription ? "Switch Plan" : "Subscribe Now"}
      </CheckoutButton>
    );
  };

  return (
    <motion.div 
      className={`relative ${popularPlan ? 'z-10' : ''}`}
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      whileHover={{ scale: popularPlan ? 1.05 : 1.02 }}
    >
      <Card 
        className={`relative overflow-hidden border ${
          popularPlan 
            ? 'border-2 border-primary rounded-2xl p-8 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform md:scale-105 hover:shadow-2xl' 
            : 'rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl'
        } transition-all duration-500 hover:-translate-y-2`}
      >
        {/* Decorative corner gradient */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-80 rounded-full"></div>
        
        {popularPlan && <PricingPopularBadge />}
        
        <div className="mb-4">
          <PricingPlanBadge text={badgeText} colorClass={badgeColor} />
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
        </div>
        
        <PricingPlanPrice
          price={price}
          period={period}
          planType={planType}
        />
        
        <PricingFeatureList 
          features={features} 
          highlightAll={highlightFeatures}
          delay={animationDelay + 0.2}
        />
        
        {renderSubscriptionButton()}
      </Card>
    </motion.div>
  );
}
