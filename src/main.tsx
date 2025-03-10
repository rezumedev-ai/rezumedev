
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure favicon is properly loaded
const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (link) {
  link.href = '/custom-favicon.svg';
}

createRoot(document.getElementById("root")!).render(<App />);
