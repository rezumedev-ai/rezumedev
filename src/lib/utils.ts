
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Function to check if a route is public
export function isPublicRoute(path: string): boolean {
  const PUBLIC_ROUTES = [
    '/', '/login', '/signup', '/features', '/pricing', '/blog', 
    '/privacy', '/terms', '/cookies', '/about', '/contact', '/careers', '/guides',
    // Explicitly add blog post routes as public
    '/blog/'
  ];
  
  return PUBLIC_ROUTES.some(route => {
    // For exact routes
    if (path === route) return true;
    
    // For blog and other paths with subpages
    if (route.endsWith('/') && path.startsWith(route)) return true;
    
    // For paths that start with a specific route
    return path.startsWith(`${route}/`);
  });
}
