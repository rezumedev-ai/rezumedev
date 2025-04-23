
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  titleClassName?: string;
  descriptionClassName?: string;
  align?: "left" | "center" | "right";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  description,
  badge,
  titleClassName,
  descriptionClassName,
  align = "center"
}) => {
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right"
  };

  return (
    <div className={`flex flex-col ${alignmentClasses[align]}`}>
      {badge && (
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
          {badge.icon}
          <span>{badge.text}</span>
        </div>
      )}
      
      <h2 className={cn(
        "text-3xl font-bold sm:text-4xl",
        titleClassName
      )}>
        {title}
      </h2>
      
      {description && (
        <p className={cn(
          "mt-4 text-lg text-muted-foreground",
          descriptionClassName
        )}>
          {description}
        </p>
      )}
    </div>
  );
};
