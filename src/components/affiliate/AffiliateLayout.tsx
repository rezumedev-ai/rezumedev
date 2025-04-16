
import React from "react";
import { useAffiliateTracking } from "@/hooks/use-affiliate-tracking";

type AffiliateLayoutProps = {
  children: React.ReactNode;
};

export const AffiliateLayout: React.FC<AffiliateLayoutProps> = ({ children }) => {
  // Track affiliate referrals
  useAffiliateTracking();
  
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};
