
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

// Initialize the application
const initializeApp = () => {
  setupFavicons();
  
  // Measure page load performance using modern Performance API
  if (window.performance) {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const navEntry = navEntries[0] as PerformanceNavigationTiming;
      const pageLoadTime = navEntry.domContentLoadedEventEnd - navEntry.startTime;
      console.log(`Page loaded in: ${pageLoadTime}ms`);
    } else {
      // Fallback if navigation timing isn't available
      const pageLoadTime = performance.now();
      console.log(`Page loaded in approximately: ${pageLoadTime}ms`);
    }
  }
  
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
});

initializeApp();
