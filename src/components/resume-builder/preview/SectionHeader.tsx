
import { Briefcase, GraduationCap, Award, Star } from "lucide-react";
import { ResumeTemplate } from "../templates";

interface SectionHeaderProps {
  title: string;
  type: "experience" | "education" | "skills" | "certifications";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  const getIcon = () => {
    if (!template.style.icons.sections) return null;

    switch (type) {
      case "experience":
        return <Briefcase className="w-5 h-5" />;
      case "education":
        return <GraduationCap className="w-5 h-5" />;
      case "certifications":
        return <Award className="w-5 h-5" />;
      case "skills":
        return <Star className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <h3 className={template.style.sectionStyle}>
      {getIcon()}
      {title}
    </h3>
  );
}
