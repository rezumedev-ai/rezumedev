
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
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Get and store auth token when component mounts
  useEffect(() => {
    const fetchToken = async () => {
      if (user) {
        const token = await getAuthToken();
        setAuthToken(token);
        console.log("🔑 AUTH: CheckoutButton initialized with token:", token ? "Available" : "Not available");
      }
    };
    
    fetchToken();
  }, [user, getAuthToken]);

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
        console.error("🔴 ERROR: Session error:", sessionError);
        throw new Error("Authentication error. Please try logging in again.");
      }
      
      if (!session) {
        console.error("🔴 ERROR: No session found");
        throw new Error("Authentication session expired. Please log in again.");
      }
      
      // Log session and token details for debugging
      console.log("🔑 AUTH: Using session:", {
        userId: session.user.id,
        email: session.user.email,
        expiresAt: new Date(session.expires_at * 1000).toLocaleString(),
        hasToken: !!session.access_token
      });
      
      // Log token details from current session
      const currentToken = session.access_token;
      console.log("🔑 AUTH: Current token:", currentToken ? `${currentToken.substring(0, 15)}...` : "No token");
      
      // Add timestamp parameter to avoid caching issues
      const timestamp = new Date().getTime();
      
      // Log the attempt with useful debugging info
      console.log("🔵 INFO: Initiating checkout for:", {
        user: user.id,
        plan: planType,
        timestamp,
        authHeader: currentToken ? "Present" : "Missing"
      });

      // Log headers that will be sent with the request
      const headers = {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json"
      };
      console.log("🔵 INFO: Request headers:", JSON.stringify(headers, null, 2));

      // Make the request to create a checkout session
      const { data: sessionData, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          planType,
          userId: user.id, // Explicitly include user ID in the request
          successUrl: `${window.location.origin}/payment-success?t=${timestamp}`,
          cancelUrl: `${window.location.origin}/pricing?t=${timestamp}`,
        },
      });

      if (error) {
        console.error("🔴 ERROR: Function error:", error);
        throw new Error(error.message || "Function error");
      }

      if (!sessionData) {
        console.error("🔴 ERROR: No session data returned");
        throw new Error("No response from checkout service");
      }

      // Log checkout details for debugging
      console.log("✅ SUCCESS: Checkout response:", sessionData);

      // Redirect to Stripe checkout
      if (sessionData?.url) {
        toast.success("Redirecting to Stripe", {
          description: "You'll be redirected to complete your payment"
        });
        window.location.href = sessionData.url;
      } else {
        console.error("🔴 ERROR: Missing checkout URL in response", sessionData);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("🔴 ERROR: Error starting checkout:", error);
      
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
