
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      {children}
    </TooltipProvider>
  );
};
