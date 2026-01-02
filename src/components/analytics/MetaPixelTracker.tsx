
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Meta Pixel page view tracker component
export const MetaPixelPageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Track PageView on route change
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    }, [location.pathname]);

    return null;
};
