
import { useEffect } from "react";
import { useIsMobile } from "./use-mobile";
import { toast } from "sonner";

export function useViewportScale() {
  const isMobile = useIsMobile();

  // Set initial viewport scale based on device
  useEffect(() => {
    // Default scaling for mobile
    if (isMobile) {
      setViewportScale(0.15);
    }
    
    // Cleanup function to restore original viewport meta
    return () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [isMobile]);

  // Function to set the viewport scale
  const setViewportScale = (scale: number) => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=2.0, user-scalable=yes`);
    }
  };

  // Maximum zoom out function
  const maxZoomOut = () => {
    setViewportScale(0.1);
    toast.success("Maximum zoom out applied");
  };

  return { maxZoomOut, setViewportScale };
}
