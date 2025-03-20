
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
