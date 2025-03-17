
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PricingLayout } from "@/components/pricing/PricingLayout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { PricingInfo } from "@/components/pricing/PricingInfo";

export type PlanType = "monthly" | "yearly" | "lifetime";

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

  const hasActiveSubscription = profile?.subscription_status === 'active' && profile?.subscription_plan;
  const currentPlan = profile?.subscription_plan as PlanType | undefined;

  return (
    <PricingLayout>
      <PricingHeader 
        hasActiveSubscription={hasActiveSubscription} 
        currentPlan={currentPlan} 
      />
      
      <PricingPlans 
        hasActiveSubscription={hasActiveSubscription} 
        currentPlan={currentPlan} 
      />
      
      <PricingInfo />
    </PricingLayout>
  );
};

export default Pricing;
