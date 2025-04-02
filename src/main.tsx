
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Function to ensure all favicon-related elements use the custom favicon
const setupFavicons = () => {
  // Update all favicon links
  const links = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
  links.forEach(link => {
    if (link.type === "image/x-icon") {
      link.href = '/favicon1.ico';
    } else {
      link.href = '/custom-favicon.svg';
    }
  });

  // Ensure apple-touch-icon is set
  const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
  if (appleIcon) {
    appleIcon.href = '/custom-favicon.svg';
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
