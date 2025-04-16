
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

// Add enhanced PDF rendering optimization
const setupPdfOptimizations = () => {
  // Create a style element for PDF-specific CSS
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      /* Global PDF icon alignment fixes */
      [data-pdf-contact-icon="true"], 
      [data-pdf-section-icon="true"], 
      [data-pdf-bullet="true"],
      .pdf-contact-icon, 
      .pdf-section-icon, 
      .pdf-bullet-char {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        vertical-align: middle !important;
        transform: translateY(0) !important;
        line-height: 1 !important;
      }
      
      /* Resume content fixes for print */
      #resume-content svg {
        vertical-align: middle !important;
      }
      
      /* Special template fixes */
      .professional-navy-contact-icon,
      .modern-professional-contact-icon,
      .minimal-elegant-contact-icon,
      .executive-clean-contact-icon,
      .professional-executive-contact-icon {
        display: inline-flex !important;
        align-items: center !important;
        vertical-align: middle !important;
        margin-top: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// Initialize the application
const initializeApp = () => {
  setupFavicons();
  setupPdfOptimizations();
  
  // Add performance measurements
  if (window.performance) {
    const pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in: ${pageLoadTime}ms`);
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
