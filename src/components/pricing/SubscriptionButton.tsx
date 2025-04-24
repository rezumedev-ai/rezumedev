
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { PlanType } from "@/hooks/use-pricing";

interface SubscriptionButtonProps {
  planType: PlanType;
  hasActiveSubscription: boolean;
  currentPlan?: PlanType;
}

export const SubscriptionButton = ({
  planType,
  hasActiveSubscription,
  currentPlan,
}: SubscriptionButtonProps) => {
  if (planType === "free") {
    return (
      <Button asChild variant="outline" className="w-full">
        <Link to="/signup">Get Started Free</Link>
      </Button>
    );
  }

  if (hasActiveSubscription && currentPlan === planType) {
    return (
      <Button variant="outline" className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" disabled>
        <CheckCircle className="mr-2 h-4 w-4" />
        Current Plan
      </Button>
    );
  }

  return (
    <CheckoutButton
      planType={planType}
      className={`w-full hover:scale-105 transition-transform ${
        hasActiveSubscription ? "bg-blue-600 hover:bg-blue-700" : ""
      }`}
    >
      {hasActiveSubscription ? "Switch Plan" : "Subscribe Now"}
    </CheckoutButton>
  );
};
