
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getResponsiveStyles(isMobile: boolean): Record<string, string> {
  return {
    container: isMobile ? "px-2 py-2" : "px-6 py-4",
    heading: isMobile ? "text-lg mb-2" : "text-xl mb-4",
    button: isMobile ? "text-xs py-1 px-2" : "text-sm py-2 px-4",
  };
}
