
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force favicon to be the custom one
const links = document.querySelectorAll("link[rel*='icon']") as NodeListOf<HTMLLinkElement>;
links.forEach(link => {
  link.href = '/custom-favicon.svg';
});

// Also ensure apple-touch-icon is set
const appleIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
if (appleIcon) {
  appleIcon.href = '/custom-favicon.svg';
}

createRoot(document.getElementById("root")!).render(<App />);
