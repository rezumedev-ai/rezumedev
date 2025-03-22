
import React from 'react';
import { Briefcase, GraduationCap, Award, Star, FileText, User, Code, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "../templates";

type IconType = "experience" | "education" | "skills" | "certifications" | "summary" | "profile" | "projects";

interface SectionIconProps {
  type: IconType;
  template: ResumeTemplate;
  className?: string;
}

export function SectionIcon({ type, template, className }: SectionIconProps) {
  if (!template.style.icons.sections) return null;

  const getIconColor = () => {
    return template.id === "professional-navy" 
      ? "text-[#0F2B5B]" 
      : "text-emerald-600";
  };

  const getIconSize = () => {
    return template.id === "professional-navy" 
      ? "w-4 h-4" 
      : "w-5 h-5";
  };

  const renderIcon = () => {
    const iconColor = getIconColor();
    const iconSize = getIconSize();
    
    switch (type) {
      case "experience":
        return <Briefcase className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "education":
        return <GraduationCap className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "certifications":
        return <Award className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "skills":
        return <Code className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "summary":
        return <FileText className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "profile":
        return <User className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      case "projects":
        return <FolderKanban className={`${iconSize} ${iconColor} flex-shrink-0`} />;
      default:
        return null;
    }
  };

  return (
    <span className={cn("section-icon-container", className)}>
      {renderIcon()}
    </span>
  );
}
