
import { Briefcase, GraduationCap, Award, Star, FileText, User, Code, FolderKanban } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  type?: "experience" | "education" | "skills" | "certifications" | "summary" | "profile" | "projects";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  const getIcon = () => {
    if (!template.style.icons.sections) return null;

    let iconElement = null;
    let iconClass = template.id === "professional-navy" 
      ? "w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0"
      : "w-5 h-5 mr-2 text-emerald-600 flex-shrink-0";

    switch (type) {
      case "experience":
        iconElement = <Briefcase className={iconClass} />;
        break;
      case "education":
        iconElement = <GraduationCap className={iconClass} />;
        break;
      case "certifications":
        iconElement = <Award className={iconClass} />;
        break;
      case "skills":
        iconElement = <Code className={iconClass} />;
        break;
      case "summary":
        iconElement = <FileText className={iconClass} />;
        break;
      case "profile":
        iconElement = <User className={iconClass} />;
        break;
      case "projects":
        iconElement = <FolderKanban className={iconClass} />;
        break;
      default:
        return null;
    }

    return (
      <div className="pdf-section-icon inline-flex items-center justify-center" data-pdf-section-icon="true">
        {iconElement}
      </div>
    );
  };

  if (template.id === "modern-professional") {
    return (
      <h3 className={template.style.sectionStyle}>
        <div className="flex items-center after:content-[''] after:block after:h-0.5 after:flex-grow after:ml-2 after:bg-emerald-500">
          {getIcon()}
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  if (template.id === "professional-navy") {
    return (
      <h3 className={template.style.sectionStyle}>
        <div className="flex items-center">
          {getIcon()}
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  if (template.id === "modern-split") {
    return (
      <h3 className={template.style.sectionStyle}>
        <span className="flex items-center">
          <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1 pdf-section-icon" data-pdf-section-divider="true"></span>
          <span>{title}</span>
        </span>
      </h3>
    );
  }

  return (
    <h3 className={cn(template.style.sectionStyle)}>
      <div className="flex items-center">
        {getIcon()}
        <span>{title}</span>
      </div>
    </h3>
  );
}
