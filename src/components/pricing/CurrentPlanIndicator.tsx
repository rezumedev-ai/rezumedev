
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CurrentPlanIndicator() {
  return (
    <Button 
      variant="outline" 
      className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" 
      disabled
    >
      <CheckCircle className="mr-2 h-4 w-4" />
      Current Plan
    </Button>
  );
}
