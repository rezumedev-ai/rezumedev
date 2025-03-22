
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
  withBackground?: boolean;
}

export function SectionContainer({ 
  children, 
  className,
  withBorder = false,
  withBackground = false
}: SectionContainerProps) {
  return (
    <div className={cn(
      "mt-1",
      withBorder && "border border-border/50 rounded-xl",
      withBackground && "bg-card/40 backdrop-blur-sm",
      className
    )}>
      {children}
    </div>
  );
}
