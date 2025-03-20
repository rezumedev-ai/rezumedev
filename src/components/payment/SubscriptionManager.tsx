import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Clock, Shield, Loader2 } from "lucide-react";
import { useProfileQuery } from "@/components/dashboard/resume-list/useProfileQuery";
import { STRIPE_TEST_MODE } from "@/integrations/stripe/client";
import { motion } from "framer-motion";

export type SubscriptionStatus = "active" | "canceled" | "inactive" | null;

interface ExtendedProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  email_notifications: boolean;
  desktop_notifications: boolean;
  resume_preferences: any;
  subscription_id: string;
  subscription_status: string;
  subscription_plan: string;
  payment_method: string;
  is_test_subscription?: boolean;
}

export const SubscriptionManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isLoadingProfile } = useProfileQuery(user);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p>Something went wrong loading your profile. Please try again later.</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  const hasSubscription = !!profile.subscription_id;
  const subscriptionStatus = profile.subscription_status as SubscriptionStatus || "inactive";
  const planType = profile.subscription_plan;
  const isTestSubscription = (profile as ExtendedProfile).is_test_subscription || false;

  const getPlanLabel = (plan: string | null) => {
    if (!plan) return "None";
    
    switch (plan) {
      case "monthly":
        return "Monthly Plan ($9.99/month)";
      case "yearly":
        return "Yearly Plan ($7.49/month, billed annually)";
      case "lifetime":
        return "Lifetime Plan (One-time payment)";
      default:
        return plan.charAt(0).toUpperCase() + plan.slice(1);
    }
  };

  const getStatusColor = (status: SubscriptionStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !profile.subscription_id) return;
    
    if (window.confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your current billing period.")) {
      setIsCancelling(true);
      
      try {
        const { error } = await supabase.from("profiles")
          .update({
            subscription_status: "canceled",
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);
          
        if (error) throw error;
        
        toast.success("Subscription canceled", {
          description: "Your subscription will remain active until the end of the current billing period."
        });
        
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } catch (error) {
        console.error("Error canceling subscription:", error);
        toast.error("Failed to cancel subscription", {
          description: "Please try again later or contact support."
        });
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const handleReactivateSubscription = async () => {
    if (!user || !profile.subscription_id) return;
    
    setIsReactivating(true);
    toast.info("Reactivating subscription...");
    
    try {
      const { data, error } = await supabase.functions.invoke("reactivate-subscription", {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      toast.success("Subscription reactivated", {
        description: "Your subscription has been successfully reactivated."
      });
      
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Failed to reactivate subscription", {
        description: "Please try again later or contact support."
      });
    } finally {
      setIsReactivating(false);
    }
  };

  const handleChangePlan = () => {
    navigate("/pricing");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscription Status</span>
            {(STRIPE_TEST_MODE || isTestSubscription) && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Test Mode
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage your current subscription plan and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Current Plan</h3>
              <p className="text-lg font-semibold">{getPlanLabel(planType)}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="flex items-center">
                <Badge className={getStatusColor(subscriptionStatus)}>
                  {subscriptionStatus === "active" && (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  )}
                  {subscriptionStatus === "canceled" && (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {subscriptionStatus?.charAt(0).toUpperCase() + subscriptionStatus?.slice(1) || "Inactive"}
                </Badge>
                
                {subscriptionStatus === "canceled" && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    (Access until end of billing period)
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {hasSubscription && (
            <div className="pt-2 border-t">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Subscriber Benefits</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Unlimited resume creation</li>
                    <li>• Access to all premium templates</li>
                    <li>• AI-powered resume optimization</li>
                    <li>• Priority support</li>
                    {planType === "yearly" && <li>• Early access to new features</li>}
                    {planType === "lifetime" && <li>• Lifetime updates and access</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          {!hasSubscription && (
            <Button 
              onClick={() => navigate("/pricing")}
              className="w-full sm:w-auto"
            >
              View Pricing Plans
            </Button>
          )}
          
          {subscriptionStatus === "active" && (
            <>
              <Button 
                variant="outline" 
                onClick={handleChangePlan}
                className="w-full sm:w-auto"
              >
                Change Plan
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="w-full sm:w-auto"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </Button>
            </>
          )}
          
          {subscriptionStatus === "canceled" && (
            <Button 
              onClick={handleReactivateSubscription}
              disabled={isReactivating}
              className="w-full sm:w-auto"
            >
              {isReactivating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reactivating...
                </>
              ) : (
                "Reactivate Subscription"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
