
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider as ToastUIProvider } from "@/components/ui/toast";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastUIProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ToastUIProvider>
  );
};
