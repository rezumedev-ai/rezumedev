
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logPerformance, setupFavicons, setupPdfOptimizations } from './lib/app-setup';

// Initialize the application
const initializeApp = () => {
  setupFavicons();
  setupPdfOptimizations();
  logPerformance();

  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found");
  }
};

initializeApp();
