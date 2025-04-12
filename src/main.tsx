
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
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found");
  }
};

initializeApp();
