
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  // Handle special case for "Present" or empty strings
  if (dateString === 'Present' || dateString.trim() === '') {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format as "MMM yyyy" (e.g., "Jan 2023")
    return format(date, 'MMM yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// Add any other utility functions here
