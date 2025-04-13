import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to ensure all favicon-related elements use the custom favicon
const setupFavicons = () => {
  // Update all favicon links
  const links = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
  links.forEach(link => {
    // Use ICO for traditional favicon and SVG for others
    if (link.rel === 'icon' && !link.type) {
      link.href = '/custom-favicon.ico';
    } else if (link.sizes) {
      // For sized icons, use the ICO
      link.href = '/custom-favicon.ico';
    } else {
      // For SVG specific
      link.href = '/custom-favicon.svg';
    }
  });

  // Ensure apple-touch-icon is set
  const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
  if (appleIcon) {
    appleIcon.href = '/custom-favicon.ico';
  }

  // Ensure shortcut icon is set
  const shortcutIcon = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement;
  if (shortcutIcon) {
    shortcutIcon.href = '/custom-favicon.ico';
  }

  // Set Microsoft Tile image
  const msIcon = document.querySelector("meta[name='msapplication-TileImage']") as HTMLMetaElement;
  if (msIcon) {
    msIcon.content = '/custom-favicon.svg';
  }
};

// Enhanced performance monitoring
const trackPerformance = () => {
  if (window.performance) {
    // Navigation Timing API
    if (window.performance.timing) {
      const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      console.log(`Page loaded in: ${pageLoadTime}ms`);
    }
    
    // Performance Observer API for Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lcpEntry = entries[entries.length - 1];
          console.log('LCP:', lcpEntry.startTime, 'ms');
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime, 'ms');
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          entryList.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.error('Performance Observer error:', e);
      }
    }
  }
};

// Initialize the application
const initializeApp = () => {
  setupFavicons();
  trackPerformance();
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found");
  }
};

// Add event for page load complete
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Register service worker for PWA if supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
});

initializeApp();
