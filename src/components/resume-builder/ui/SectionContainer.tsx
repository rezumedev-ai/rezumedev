
import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export function SectionContainer({ children, className }: SectionContainerProps) {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
}
