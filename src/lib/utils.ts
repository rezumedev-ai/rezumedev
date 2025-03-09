
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
  const PUBLIC_ROUTES = ['/', '/login', '/signup', '/features', '/pricing', '/blog', 
                         '/privacy', '/terms', '/cookies', '/about', '/contact', '/careers', '/guides'];
  return PUBLIC_ROUTES.some(route => path === route || path.startsWith(`${route}/`));
}
