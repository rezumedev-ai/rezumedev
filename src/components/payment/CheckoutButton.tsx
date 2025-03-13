
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type PlanType = "monthly" | "yearly" | "lifetime";

interface CheckoutButtonProps {
  planType: PlanType;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children: React.ReactNode;
}

export const CheckoutButton = ({
  planType,
  disabled = false,
  className,
  variant = "default",
  children
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive"
      });
      navigate("/login", { state: { returnTo: "/pricing" } });
      return;
    }

    setIsLoading(true);
    try {
      const { data: sessionData, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          planType,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to Stripe checkout
      if (sessionData?.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleCheckout}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <span className="mr-2">Processing</span>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
