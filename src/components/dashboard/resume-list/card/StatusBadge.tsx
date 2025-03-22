
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  currentStep?: number;
  totalSteps?: number;
}

export function StatusBadge({ status, currentStep, totalSteps = 7 }: StatusBadgeProps) {
  return (
    <div className={cn(
      "text-xs px-3 py-1 rounded-full transition-colors duration-300 flex items-center gap-1",
      status === 'completed' 
        ? "bg-green-100 text-green-800 group-hover:bg-green-200"
        : "bg-amber-100 text-amber-800 group-hover:bg-amber-200"
    )}>
      {status === 'completed' ? (
        <>
          <Check className="w-3 h-3" />
          <span>Completed</span>
        </>
      ) : (
        <>
          <Clock className="w-3 h-3" />
          <span>Step {currentStep} of {totalSteps}</span>
        </>
      )}
    </div>
  );
}
