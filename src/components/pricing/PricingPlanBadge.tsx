
interface PricingPlanBadgeProps {
  text: string;
  colorClass: string;
}

export function PricingPlanBadge({ text, colorClass }: PricingPlanBadgeProps) {
  return (
    <span className={`inline-block ${colorClass} px-3 py-1 text-xs font-medium rounded-full mb-2`}>
      {text}
    </span>
  );
}
