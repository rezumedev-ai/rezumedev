
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export type PlanType = "monthly" | "yearly" | "lifetime";

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
      toast.error("Login Required", {
        description: "Please log in to subscribe to a plan"
      });
      navigate("/login", { state: { returnTo: "/pricing" } });
      return;
    }

    setIsLoading(true);
    toast.info("Preparing checkout...", {
      description: "Please wait while we connect to Stripe"
    });

    try {
      // Get the current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error. Please try logging in again.");
      }
      
      if (!session) {
        throw new Error("Authentication session expired. Please log in again.");
      }
      
      // Add timestamp parameter to avoid caching issues
      const timestamp = new Date().getTime();
      
      // Log the attempt with useful debugging info
      console.log("Initiating checkout for:", {
        user: user.id,
        plan: planType,
        timestamp
      });

      // Make sure we have the authorization header
      const { data: sessionData, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          planType,
          successUrl: `${window.location.origin}/payment-success?t=${timestamp}`,
          cancelUrl: `${window.location.origin}/pricing?t=${timestamp}`,
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Function error");
      }

      if (!sessionData) {
        console.error("No session data returned");
        throw new Error("No response from checkout service");
      }

      // Log checkout details for debugging
      console.log("Checkout response:", sessionData);

      // Redirect to Stripe checkout
      if (sessionData?.url) {
        toast.success("Redirecting to Stripe", {
          description: "You'll be redirected to complete your payment"
        });
        window.location.href = sessionData.url;
      } else {
        console.error("Missing checkout URL in response", sessionData);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error starting checkout:", error);
      
      let errorMessage = "Failed to start checkout process. Please try again later.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      toast.error("Checkout Error", {
        description: errorMessage
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
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
