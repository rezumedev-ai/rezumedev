
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export type PlanType = "free" | "monthly" | "yearly" | "lifetime";

export function usePricing() {
  const { user } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

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

  return {
    isAuthenticated,
    hasActiveSubscription,
    currentPlan,
    user
  };
}
