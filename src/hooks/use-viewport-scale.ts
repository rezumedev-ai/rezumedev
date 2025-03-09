
import { useEffect } from "react";

export function useViewportScale(isMobile: boolean) {
  // Set initial zoom level depending on device
  useEffect(() => {
    // Add meta tag to prevent user scaling if on mobile
    if (isMobile) {
      // Find existing viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        // Modify existing viewport meta to set initial-scale to 0.15 for extreme zoom out
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=0.15, maximum-scale=2.0, user-scalable=yes');
      }
    }

    // Cleanup function to restore original viewport meta
    return () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [isMobile]);
}
