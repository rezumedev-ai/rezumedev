
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
    mql.addEventListener("change", checkIsMobile);
    window.addEventListener("orientationchange", checkIsMobile);
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      mql.removeEventListener("change", checkIsMobile);
      window.removeEventListener("orientationchange", checkIsMobile);
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return !!isMobile;
}
