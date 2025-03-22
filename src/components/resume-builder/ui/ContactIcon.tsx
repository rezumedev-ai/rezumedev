
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContactIconProps {
  children: ReactNode;
  className?: string;
  template?: string;
}

export function ContactIcon({ children, className, template = "default" }: ContactIconProps) {
  // Apply both regular and PDF-specific classes
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center mr-2 flex-shrink-0",
        template === "professional-navy" ? "professional-navy-contact-icon" : "",
        "pdf-contact-icon", // Always add PDF class
        className
      )}
      data-pdf-contact-icon="true"
    >
      {children}
    </span>
  );
}
