
import { Briefcase, GraduationCap, Award, Star, FileText, User, Code } from "lucide-react";
import { ResumeTemplate } from "../templates";

interface SectionHeaderProps {
  title: string;
  type?: "experience" | "education" | "skills" | "certifications" | "summary" | "profile" | "projects";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  const getIcon = () => {
    if (!template.style.icons.sections) return null;

    switch (type) {
      case "experience":
        return <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />;
      case "education":
        return <GraduationCap className="w-5 h-5 mr-2 text-emerald-600" />;
      case "certifications":
        return <Award className="w-5 h-5 mr-2 text-emerald-600" />;
      case "skills":
        return <Code className="w-5 h-5 mr-2 text-emerald-600" />;
      case "summary":
        return <FileText className="w-5 h-5 mr-2 text-emerald-600" />;
      case "profile":
        return <User className="w-5 h-5 mr-2 text-emerald-600" />;
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

  return (
    <h3 className={template.style.sectionStyle}>
      <div className="flex items-center">
        {getIcon()}
        <span>{title}</span>
      </div>
    </h3>
  );
}
