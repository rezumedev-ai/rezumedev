
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

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/appsumo", // Added AppSumo route
  "/pricing",
  "/about",
  "/features",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/help",
  "/blog",
  "/guides",
  "/careers"
];

// Checks if a route is public and doesn't require authentication
export function isPublicRoute(path: string): boolean {
  // Exact match for defined public routes
  if (PUBLIC_ROUTES.includes(path)) {
    return true;
  }
  
  // Check for blog post routes
  if (path.startsWith("/blog/")) {
    return true;
  }
  
  // Check for guide routes
  if (path.startsWith("/guides/")) {
    return true;
  }
  
  return false;
}

// Add any other utility functions here

