
import { Briefcase, GraduationCap, Award, Star, FileText, User, Code, FolderKanban, Globe, Globe2 } from "lucide-react";
import { ResumeTemplate } from "../templates";

interface SectionHeaderProps {
  title: string;
  type?: "experience" | "education" | "skills" | "certifications" | "summary" | "profile" | "projects" | "languages";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  const getIcon = () => {
    if (!template.style.icons.sections) return null;

    switch (type) {
      case "experience":
        return template.id === "professional-navy" 
          ? <Briefcase className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <Briefcase className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "education":
        return template.id === "professional-navy"
          ? <GraduationCap className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <GraduationCap className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "certifications":
        return template.id === "professional-navy"
          ? <Award className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <Award className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "skills":
        return template.id === "professional-navy"
          ? <Code className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <Code className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "summary":
        return template.id === "professional-navy"
          ? <FileText className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <FileText className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "profile":
        return template.id === "professional-navy"
          ? <User className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <User className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "projects":
        return template.id === "professional-navy"
          ? <FolderKanban className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <FolderKanban className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      case "languages":
        return template.id === "professional-navy"
          ? <Globe className="w-4 h-4 mr-2 text-[#0F2B5B] flex-shrink-0" />
          : <Globe2 className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />;
      default:
        return null;
    }
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

  return (
    <h3 className={template.style.sectionStyle}>
      <div className="flex items-center">
        {getIcon()}
        <span>{title}</span>
      </div>
    </h3>
  );
}
