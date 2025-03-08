
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getResponsiveScale(isMobile: boolean, isZoomed: boolean): number {
  if (isMobile) {
    return isZoomed ? 0.9 : 0.65;
  }
  return 1;
}
