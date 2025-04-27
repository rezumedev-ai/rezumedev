
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Settings } from "lucide-react";

interface ManageSubscriptionButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
}

export const ManageSubscriptionButton = ({
  className,
  variant = "outline",
  children = "Manage Subscription"
}: ManageSubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleManageSubscription = async () => {
    setIsLoading(true);
    toast.info("Loading subscription portal...");

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { returnUrl: window.location.href }
      });

      if (error) {
        console.error("Portal error:", error);
        throw error;
      }

      if (!data?.url) {
        throw new Error("No portal URL returned");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Subscription portal error:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to access subscription portal";
      
      toast.error("Subscription Portal Error", {
        description: errorMessage === "No portal URL returned"
          ? "Unable to create subscription portal. Please try again later."
          : errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleManageSubscription}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <span className="mr-2">Loading</span>
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          {children}
        </div>
      )}
    </Button>
  );
};
