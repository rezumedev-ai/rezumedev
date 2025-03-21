
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      // Check both screen width and user agent for better detection
      const isMobileByWidth = window.innerWidth < MOBILE_BREAKPOINT;
      const isMobileByAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Consider it mobile if either condition is true
      setIsMobile(isMobileByWidth || isMobileByAgent);
    };
    
    // Initial check
    checkIsMobile();
    
    // Setup listeners
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Use event listener with a handler function (more compatibility)
    const handleMediaChange = () => checkIsMobile();
    
    // Modern browsers use addEventListener, older versions use addListener
    if (mql.addEventListener) {
      mql.addEventListener("change", handleMediaChange);
    } else if (mql.addListener) {
      // For older browsers
      mql.addListener(handleMediaChange);
    }
    
    window.addEventListener("orientationchange", checkIsMobile);
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", handleMediaChange);
      } else if (mql.removeListener) {
        // For older browsers
        mql.removeListener(handleMediaChange);
      }
      window.removeEventListener("orientationchange", checkIsMobile);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return isMobile;
}
