
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react"; 

interface BulletPointProps {
  children: ReactNode;
  className?: string;
  bulletClassName?: string;
  textClassName?: string;
  template?: string;
  type?: "default" | "skill";
}

export function BulletPoint({ 
  children, 
  className,
  bulletClassName,
  textClassName,
  template = "default",
  type = "default"
}: BulletPointProps) {
  // Template-specific styling
  const bulletStyle = {
    default: "w-1.5 h-1.5 rounded-full bg-black",
    "modern-split": "w-1 h-1 rounded-full bg-black",
    "professional-navy": "w-1.5 h-1.5 rounded-full bg-[#0F2B5B]",
    "modern-professional": "w-1.5 h-1.5 rounded-full bg-emerald-600",
    "executive-clean": "w-1.5 h-1.5 rounded-full bg-gray-800",
    "minimal-elegant": "w-1 h-1 rounded-full bg-gray-700",
    "professional-executive": "w-1.5 h-1.5 rounded-full bg-black"
  };

  // Use the arrow character for skills
  if (type === "skill") {
    return (
      <li className={cn("flex items-start gap-1.5 pdf-bullet-item", className)}>
        <div 
          className={cn(
            "inline-flex items-center justify-center shrink-0 mt-0.5 pdf-bullet-marker",
            bulletClassName
          )}
          aria-hidden="true"
          data-pdf-bullet="true"
          data-pdf-bullet-type="skill"
        >
          <span className="text-lg text-gray-700">➤</span>
        </div>
        <div className={cn("pdf-bullet-text", textClassName)}>
          {children}
        </div>
      </li>
    );
  }

  // Default bullet rendering
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
        data-pdf-bullet-type="default"
        style={{ minWidth: "6px", minHeight: "6px" }}
      ></div>
      <div className={cn("pdf-bullet-text", textClassName)}>
        {children}
      </div>
    </div>
  );
}
