
import { useEffect } from 'react';
import { trackAffiliateClick } from '@/utils/affiliateTracker';

export function useAffiliateTracking() {
  useEffect(() => {
    const checkAndTrackAffiliate = async () => {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      // If ref code exists, track the affiliate click
      if (refCode) {
        try {
          await trackAffiliateClick(refCode);
          
          // Remove ref parameter from URL (optional)
          urlParams.delete('ref');
          const newUrl = window.location.pathname + 
            (urlParams.toString() ? '?' + urlParams.toString() : '');
          window.history.replaceState({}, document.title, newUrl);
        } catch (error) {
          console.error("Error tracking affiliate click:", error);
        }
      }
    };
    
    checkAndTrackAffiliate();
  }, []);
}
