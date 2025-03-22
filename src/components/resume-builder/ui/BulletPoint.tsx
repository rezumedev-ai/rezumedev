
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BulletPointProps {
  children: ReactNode;
  className?: string;
  bulletClassName?: string;
  textClassName?: string;
  template?: string;
}

export function BulletPoint({ 
  children, 
  className,
  bulletClassName,
  textClassName,
  template = "default"
}: BulletPointProps) {
  // Template-specific styling
  const bulletStyle = {
    default: "w-1.5 h-1.5 rounded-full bg-black",
    "modern-split": "w-1 h-1 rounded-full bg-black",
    "professional-navy": "text-[#0F2B5B] flex items-center",
    "modern-professional": "text-emerald-600 flex items-center",
    "executive-clean": "w-1.5 h-1.5 rounded-full bg-gray-800",
    "minimal-elegant": "w-1 h-1 rounded-full bg-gray-700",
    "professional-executive": "w-1.5 h-1.5 rounded-full bg-black"
  };

  // For templates that use the arrow bullet point
  if (template === "professional-navy" || template === "modern-professional") {
    return (
      <li className={cn("flex items-start gap-2 pdf-bullet-item", className)}>
        <span 
          className={cn(
            "inline-flex items-center justify-center shrink-0 mt-1 pdf-bullet-marker",
            bulletStyle[template as keyof typeof bulletStyle] || bulletStyle.default,
            bulletClassName
          )}
          aria-hidden="true"
          data-pdf-bullet="true"
        >
          ➤
        </span>
        <div className={cn("pdf-bullet-text", textClassName)}>
          {children}
        </div>
      </li>
    );
  }

  // For all other templates (using the original dot style)
  return (
    <li className={cn("flex items-start gap-2 pdf-bullet-item", className)}>
      <div 
        className={cn(
          "inline-flex items-center justify-center shrink-0 mt-1.5 pdf-bullet-marker",
          bulletStyle[template as keyof typeof bulletStyle] || bulletStyle.default,
          bulletClassName
        )}
        aria-hidden="true"
        data-pdf-bullet="true"
      ></div>
      <div className={cn("pdf-bullet-text", textClassName)}>
        {children}
      </div>
    </li>
  );
}
