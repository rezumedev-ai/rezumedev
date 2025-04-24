
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface NavigationButtonProps {
  onBackToDashboard: () => void;
}

export function NavigationButton({ onBackToDashboard }: NavigationButtonProps) {
  return (
    <Button 
      variant="ghost" 
      onClick={onBackToDashboard}
      className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-primary hover:bg-gray-100 text-sm sm:text-base px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
    >
      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Back to Dashboard</span>
      <span className="sm:hidden">Back</span>
    </Button>
  );
}
