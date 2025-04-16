
import React from "react";
import { ToastProvider as ToastUIProvider } from "@/components/ui/toast";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastUIProvider>
      {children}
    </ToastUIProvider>
  );
};
