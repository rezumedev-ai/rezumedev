
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
        await trackAffiliateClick(refCode);
        
        // Clean URL by removing ref parameter (optional)
        const newUrl = window.location.pathname + 
          (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
      }
    };
    
    checkAndTrackAffiliate();
  }, []);
}
