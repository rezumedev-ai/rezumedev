
import React from 'react';
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "../templates";

interface BulletPointProps {
  children: React.ReactNode;
  template: ResumeTemplate;
  className?: string;
}

export function BulletPoint({ children, template, className }: BulletPointProps) {
  const getBulletStyle = () => {
    switch (template.id) {
      case "modern-professional":
        return (
          <span className="bullet-point-icon">
            <span className="modern-professional-bullet">➤</span>
          </span>
        );
      case "professional-navy":
        return (
          <span className="bullet-point-icon">
            <span className="professional-navy-bullet">➤</span>
          </span>
        );
      case "modern-split":
        return (
          <span className="bullet-point-icon">
            <span className="modern-split-bullet"></span>
          </span>
        );
      case "minimal-elegant":
        return (
          <span className="bullet-point-icon">
            <span className="minimal-elegant-bullet"></span>
          </span>
        );
      case "professional-executive":
        return (
          <span className="bullet-point-icon">
            <span className="professional-executive-bullet"></span>
          </span>
        );
      default:
        return (
          <span className="bullet-point-icon">
            <span className="executive-clean-bullet"></span>
          </span>
        );
    }
  };

  return (
    <li className={cn("bullet-point-container", className)}>
      {getBulletStyle()}
      <span className="bullet-point-text">{children}</span>
    </li>
  );
}
