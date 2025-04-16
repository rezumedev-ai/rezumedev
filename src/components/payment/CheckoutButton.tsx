
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/use-subscription";
import { getStripe } from "@/lib/stripe";
import { trackAffiliateConversion } from "@/utils/affiliateTracker";
import { type PlanType } from "@/pages/Pricing";

interface CheckoutButtonProps {
  plan: {
    id: string;
    name: string;
    price: number;
    interval: string;
  };
  planType: PlanType;
  className?: string;
  children: React.ReactNode;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ 
  plan, 
  planType, 
  className = "", 
  children 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscription, isSubscribed, isLoading } = useSubscription();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsCheckoutLoading(true);

      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please log in to subscribe.",
          variant: "destructive",
        });
        return;
      }

      const stripe = await getStripe();

      if (!stripe) {
        toast({
          title: "Failed to load Stripe",
          description: "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      const { priceId } =
        plan.id === "free"
          ? { priceId: "" }
          : { priceId: plan.id };

      // Call the Supabase Edge Function to create a checkout session
      const response = await fetch("/api/create-stripe-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          customerId: user.id,
          planName: plan.name,
          planType: planType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Checkout failed",
          description: errorData.error || "Something went wrong.",
          variant: "destructive",
        });
        return;
      }

      const { sessionId } = await response.json();

      if (sessionId) {
        // Add this right before redirecting or showing success:
        await trackAffiliateConversion('subscription', plan.price);
        stripe?.redirectToCheckout({ sessionId });
      } else {
        toast({
          title: "Could not redirect to checkout",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const isLoadingState = isLoading || isCheckoutLoading;

  return (
    <Button onClick={handleCheckout} disabled={isLoadingState} className={className}>
      {children}
    </Button>
  );
};
