
import { PlanType } from "@/pages/Pricing";
import { PricingPlan } from "./PricingPlan";

interface PricingPlansProps {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export function PricingPlans({ hasActiveSubscription, currentPlan }: PricingPlansProps) {
  // Monthly plan features
  const monthlyFeatures = [
    "Unlimited resume creations",
    "AI-powered suggestions",
    "Multiple templates",
    "Export to PDF",
    "24/7 support"
  ];

  // Yearly plan features
  const yearlyFeatures = [
    "Everything in Monthly",
    "Save 25% annually",
    "Priority support",
    "Early access to new features",
    "LinkedIn integration"
  ];

  // Lifetime plan features
  const lifetimeFeatures = [
    "Everything in Yearly",
    "Lifetime updates",
    "VIP support",
    "Custom branding",
    "API access"
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
      {/* Monthly Plan */}
      <PricingPlan
        planType="monthly"
        title="Monthly"
        price="$9.99"
        period="/month"
        badgeText="Monthly Plan"
        badgeColor="bg-blue-100 text-blue-700"
        features={monthlyFeatures}
        hasActiveSubscription={hasActiveSubscription}
        currentPlan={currentPlan}
        initialX={-50}
      />

      {/* Yearly Plan */}
      <PricingPlan
        planType="yearly"
        title="Yearly"
        price="$7.49"
        period="/month"
        badgeText="Yearly Plan"
        badgeColor="bg-primary/80 text-white"
        features={yearlyFeatures}
        popularPlan={true}
        highlightFeatures={true}
        hasActiveSubscription={hasActiveSubscription}
        currentPlan={currentPlan}
        animationDelay={0.2}
        initialX={0}
      />

      {/* Lifetime Plan */}
      <PricingPlan
        planType="lifetime"
        title="Lifetime"
        price="$199"
        period="/one-time"
        badgeText="Lifetime Plan"
        badgeColor="bg-emerald-100 text-emerald-700"
        features={lifetimeFeatures}
        hasActiveSubscription={hasActiveSubscription}
        currentPlan={currentPlan}
        animationDelay={0.4}
        initialX={50}
      />
    </div>
  );
}
