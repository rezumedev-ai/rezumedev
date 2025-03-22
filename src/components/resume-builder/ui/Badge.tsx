
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "info";
  size?: "xs" | "sm" | "md";
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
    info: "bg-blue-100 text-blue-800",
  };
  
  const sizeClasses = {
    xs: "text-[9px] px-1 py-0.5",
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
  };
  
  return (
    <div className={cn(
      "rounded-full transition-colors duration-300 flex items-center gap-1 font-medium",
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
