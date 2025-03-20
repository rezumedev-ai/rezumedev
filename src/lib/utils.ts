
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  // Handle special cases like "Present" or "Current"
  if (dateString === 'Present' || dateString === 'Current') {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      // If not a valid date, return the original string
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (error) {
    // If there's an error parsing the date, return the original string
    return dateString;
  }
}

export function isPublicRoute(path: string): boolean {
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/about',
    '/features',
    '/pricing',
    '/blog',
    '/contact',
    '/help',
    '/guides',
    '/terms',
    '/privacy',
    '/cookies',
    '/careers',
    '/payment-success'
  ];
  
  // Check if the path exactly matches a public route
  if (publicRoutes.includes(path)) {
    return true;
  }
  
  // Check for blog posts that have the pattern /blog/something
  if (path.startsWith('/blog/')) {
    return true;
  }
  
  return false;
}
