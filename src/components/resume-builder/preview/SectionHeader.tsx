
import { Briefcase, GraduationCap, Award, FileText, User, Code, FolderKanban } from "lucide-react";
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

    let iconClass = "";
    
    // Set colors based on template with more visible colors
    if (template.id === "professional-navy") {
      iconClass = "w-5 h-5 mr-2 text-[#0F2B5B] flex-shrink-0";
    } else if (template.id === "modern-professional") {
      iconClass = "w-5 h-5 mr-2 text-emerald-600 flex-shrink-0";
    } else if (template.id === "executive-clean") {
      iconClass = "w-5 h-5 mr-2 text-gray-800 flex-shrink-0"; 
    } else if (template.id === "minimal-elegant") {
      iconClass = "w-5 h-5 mr-2 text-gray-700 flex-shrink-0";
    } else if (template.id === "professional-executive") {
      iconClass = "w-5 h-5 mr-2 text-black flex-shrink-0";
    } else {
      iconClass = "w-5 h-5 mr-2 text-gray-800 flex-shrink-0";
    }

    let iconElement = null;
    
    switch (type) {
      case "experience":
        iconElement = <Briefcase className={iconClass} strokeWidth={2.5} />;
        break;
      case "education":
        iconElement = <GraduationCap className={iconClass} strokeWidth={2.5} />;
        break;
      case "certifications":
        iconElement = <Award className={iconClass} strokeWidth={2.5} />;
        break;
      case "skills":
        iconElement = <Code className={iconClass} strokeWidth={2.5} />;
        break;
      case "summary":
        iconElement = <FileText className={iconClass} strokeWidth={2.5} />;
        break;
      case "profile":
        iconElement = <User className={iconClass} strokeWidth={2.5} />;
        break;
      case "projects":
        iconElement = <FolderKanban className={iconClass} strokeWidth={2.5} />;
        break;
      default:
        return null;
    }

    // For PDF rendering, we add data attributes to identify icons for potential PDF conversion
    return (
      <div 
        className="pdf-section-icon inline-flex items-center justify-center" 
        data-pdf-section-icon="true" 
        data-pdf-icon-type={type}
        style={{ minWidth: "24px", minHeight: "24px" }}
      >
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
