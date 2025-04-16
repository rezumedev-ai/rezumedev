
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  id: string;
  status: string;
  plan: string;
  current_period_end: string;
}

interface Profile {
  subscription_id: string | null;
  subscription_status: string | null;
  subscription_plan: string | null;
  subscription_end_date: string | null;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async (): Promise<Subscription | null> => {
      if (!user) return null;

      // Get profile with subscription data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("subscription_id, subscription_status, subscription_plan, subscription_end_date")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Error fetching subscription:", error);
        return null;
      }

      // If no subscription ID, return null
      if (!profile.subscription_id) return null;

      // Format subscription data
      return {
        id: profile.subscription_id,
        status: profile.subscription_status || "inactive",
        plan: profile.subscription_plan || "",
        current_period_end: profile.subscription_end_date || "",
      };
    },
    enabled: !!user,
  });

  // Check if the user has an active subscription
  const isSubscribed = !!data && data.status === "active";

  return {
    subscription: data,
    isSubscribed,
    isLoading,
    error,
    refetch,
  };
}
