
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  className 
}: BadgeProps) {
  // Define badge styles based on variant
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/80 text-secondary-foreground",
    outline: "bg-transparent border border-gray-200 text-gray-700"
  };
  
  // Define badge sizes
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded-full",
    md: "text-xs px-2.5 py-1 rounded-full",
    lg: "text-sm px-3 py-1 rounded-full"
  };
  
  return (
    <div className={cn(
      "inline-flex items-center font-medium", 
      variantStyles[variant], 
      sizeStyles[size],
      className
    )}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}
