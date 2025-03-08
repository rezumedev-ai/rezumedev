
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function calculateResumeScale(containerWidth: number, containerHeight: number): number {
  // A4 dimensions (21cm x 29.7cm at 96 DPI)
  const resumeWidth = 793; // ~21cm at 96 DPI
  const resumeHeight = 1122; // ~29.7cm at 96 DPI
  
  // Leave some margin
  const availableWidth = containerWidth * 0.95;
  const availableHeight = containerHeight * 0.95;
  
  // Scale based on both width and height constraints
  const scaleX = availableWidth / resumeWidth;
  const scaleY = availableHeight / resumeHeight;
  
  // Use the smaller scale to ensure it fits both dimensions
  return Math.min(scaleX, scaleY, 1);
}
