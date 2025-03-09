
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

// Helper to calculate mobile-friendly scale
export function calculateResumeScale(containerWidth: number, isMobile: boolean): number {
  const resumeWidth = A4_DIMENSIONS.WIDTH_PX;
  
  if (containerWidth <= 0) return isMobile ? 0.35 : 0.85;
  
  // Calculate scale based on available width with some margin
  const maxScale = (containerWidth - 32) / resumeWidth; 
  
  // For mobile, use a fixed smaller scale to ensure the full A4 page is visible
  if (isMobile) {
    return Math.min(maxScale, 0.35);
  }
  
  // For desktop, use a comfortable scale that's not too small
  return Math.min(maxScale, 0.85);
}

// Standard A4 dimensions (in pixels at 96 DPI)
export const A4_DIMENSIONS = {
  WIDTH_CM: 21,
  HEIGHT_CM: 29.7,
  WIDTH_PX: 794, // Exact A4 width in pixels at 96 DPI
  HEIGHT_PX: 1123, // Exact A4 height in pixels at 96 DPI
};
