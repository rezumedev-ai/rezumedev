
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";
import { PricingFeatureList } from "./PricingFeatureList";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { PlanType } from "@/pages/Pricing";

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
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
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
  hasActiveSubscription,
  currentPlan,
  animationDelay = 0,
  initialX = 0
}: PricingPlanProps) {
  
  const renderSubscriptionButton = () => {
    if (hasActiveSubscription && currentPlan === planType) {
      return (
        <Button variant="outline" className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" disabled>
          <CheckCircle className="mr-2 h-4 w-4" />
          Current Plan
        </Button>
      );
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
        
        {popularPlan && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow-lg">
            <span className="text-sm font-medium text-white flex items-center">
              <Star className="w-3 h-3 mr-1 animate-pulse" />
              Most Popular
            </span>
          </div>
        )}
        
        <div className="mb-4">
          <span className={`inline-block ${badgeColor} px-3 py-1 text-xs font-medium rounded-full mb-2`}>
            {badgeText}
          </span>
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary">{price}</span>
            <span className="text-muted-foreground">{period}</span>
          </div>
          {planType === 'yearly' && (
            <p className="text-sm mt-2 text-muted-foreground">Billed annually ($89.88/year)</p>
          )}
        </div>
        
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
