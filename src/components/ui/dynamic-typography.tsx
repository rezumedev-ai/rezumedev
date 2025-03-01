
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface DynamicTypographyProps {
  content: string;
  className?: string;
  baseSize?: "text-xs" | "text-sm" | "text-base" | "text-lg";
  minSize?: "text-[10px]" | "text-xs" | "text-sm";
  minLength?: number;
  maxLength?: number;
}

/**
 * A component that dynamically adjusts font size based on content length
 */
export function DynamicTypography({
  content,
  className,
  baseSize = "text-sm",
  minSize = "text-xs",
  minLength = 30,
  maxLength = 120,
}: DynamicTypographyProps) {
  const dynamicSize = useMemo(() => {
    const contentLength = content.length;
    
    if (contentLength > maxLength) {
      return minSize;
    } else if (contentLength > minLength) {
      // For content between min and max length, use a size in between
      if (baseSize === "text-lg" && minSize === "text-xs") {
        return "text-sm";
      } else if (baseSize === "text-base" && minSize === "text-xs") {
        return "text-sm";
      } else if (baseSize === "text-sm" && minSize === "text-[10px]") {
        return "text-xs";
      }
    }
    
    return baseSize;
  }, [content, baseSize, minSize, minLength, maxLength]);

  return (
    <span className={cn(dynamicSize, className)}>
      {content}
    </span>
  );
}
