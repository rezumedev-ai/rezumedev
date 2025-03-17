
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingLayout } from "@/components/pricing/PricingLayout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PricingInfo } from "@/components/pricing/PricingInfo";

export type PlanType = "monthly" | "yearly" | "lifetime";

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

const Pricing = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });

  const subscriptionStatus: SubscriptionStatus = {
    hasActiveSubscription: profile?.subscription_status === 'active',
    currentPlan: profile?.subscription_plan as PlanType | undefined
  };

  return (
    <PricingLayout>
      <PricingHeader 
        hasActiveSubscription={subscriptionStatus.hasActiveSubscription}
        currentPlan={subscriptionStatus.currentPlan} 
      />
      
      <PricingPlans subscriptionStatus={subscriptionStatus} />
      
      <PricingInfo />
    </PricingLayout>
  );
};

export default Pricing;
