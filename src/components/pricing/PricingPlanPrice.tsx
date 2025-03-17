
import { PlanType } from "@/pages/Pricing";

interface PricingPlanPriceProps {
  price: string;
  period: string;
  planType: PlanType;
}

export function PricingPlanPrice({ price, period, planType }: PricingPlanPriceProps) {
  return (
    <div className="mb-6">
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-primary">{price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>
      {planType === 'yearly' && (
        <p className="text-sm mt-2 text-muted-foreground">Billed annually ($89.88/year)</p>
      )}
    </div>
  );
}
