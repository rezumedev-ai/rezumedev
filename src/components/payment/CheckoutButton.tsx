
import { useState, useEffect } from "react";
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

// Environment detection - determines if we're in production or development
const isProduction = window.location.hostname !== "localhost" && 
                    !window.location.hostname.includes("127.0.0.1") &&
                    !window.location.hostname.includes(".netlify.app");

// Stripe publishable keys - safe to expose in client-side code
const STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_51R0coQHK7YurnN3DGE0WvJK4EcelweO5ocXBF4Dsuxbna5HtitiQOzbb6Bk1IJZEbN5IauFwrdF9Y49bPzRpDkUP00wB2KRlZi";
const STRIPE_LIVE_PUBLISHABLE_KEY = "pk_live_51R0coQHK7YurnN3DQgm2RmqaJSXZs7bllvHjZyEGpGXaISvABbT59vNxwZ8fqwYe6VHsj5Eoe7lm1G3cq9ZsJ9I100RcqmMbkH";

export const CheckoutButton = ({
  planType,
  disabled = false,
  className,
  variant = "default",
  children
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, getAuthToken } = useAuth();
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
    toast.info("Preparing checkout...");

    try {
      // Get the current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Authentication error:", sessionError || "No session found");
        throw new Error("Authentication error. Please try logging in again.");
      }
      
      // Get current timestamp for caching prevention
      const timestamp = new Date().getTime();
      
      // Make the request to create a checkout session
      const { data: sessionData, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          planType,
          userId: user.id,
          successUrl: `${window.location.origin}/payment-success?t=${timestamp}`,
          cancelUrl: `${window.location.origin}/pricing?t=${timestamp}`,
          mode: isProduction ? "live" : "test" // Pass the mode to the edge function
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Function error");
      }

      if (!sessionData?.url) {
        console.error("No checkout URL returned:", sessionData);
        throw new Error("No checkout URL returned");
      }

      // Redirect to Stripe checkout
      toast.success("Redirecting to Stripe");
      window.location.href = sessionData.url;
      
    } catch (error) {
      console.error("Checkout error:", error);
      
      let errorMessage = "Failed to start checkout process. Please try again later.";
      
      if (error.message) {
        errorMessage = error.message;
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
