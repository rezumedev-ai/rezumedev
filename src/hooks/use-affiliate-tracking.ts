
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackAffiliateClick } from "@/utils/affiliateTracker";

export const useAffiliateTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      // Track affiliate click
      trackAffiliateClick(refCode);
    }
  }, [location.search]);
};
