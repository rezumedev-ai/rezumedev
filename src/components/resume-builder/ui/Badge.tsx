
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning";
  size?: "sm" | "md";
  icon?: ReactNode;
}

export function Badge({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon 
}: BadgeProps) {
  const variantClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
  };
  
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
  };
  
  return (
    <div className={cn(
      "rounded-full transition-colors duration-300 flex items-center gap-1",
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {icon && icon}
      <span>{children}</span>
    </div>
  );
}
