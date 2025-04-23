
import React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ 
  children, 
  className, 
  id 
}) => {
  return (
    <section id={id} className={cn("w-full", className)}>
      {children}
    </section>
  );
};
