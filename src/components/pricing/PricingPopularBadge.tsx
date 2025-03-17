
import { Star } from "lucide-react";

export function PricingPopularBadge() {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow-lg">
      <span className="text-sm font-medium text-white flex items-center">
        <Star className="w-3 h-3 mr-1 animate-pulse" />
        Most Popular
      </span>
    </div>
  );
}
