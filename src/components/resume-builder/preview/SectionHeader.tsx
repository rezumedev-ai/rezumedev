
import { ResumeTemplate } from "../templates";
import { BriefcaseBusiness, GraduationCap, Award, User, Layers } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  type: "personal" | "summary" | "experience" | "education" | "certifications" | "skills";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  const getIcon = () => {
    const iconSize = 18;
    const className = "inline-block align-text-bottom mr-2";
    
    switch (type) {
      case "personal":
        return <User size={iconSize} className={className} />;
      case "experience":
        return <BriefcaseBusiness size={iconSize} className={className} />;
      case "education":
        return <GraduationCap size={iconSize} className={className} />;
      case "certifications":
        return <Award size={iconSize} className={className} />;
      case "skills":
        return <Layers size={iconSize} className={className} />;
      default:
        return <User size={iconSize} className={className} />;
    }
  };
  
  const styles = {
    "executive-clean": {
      title: "text-base font-bold text-gray-800 uppercase tracking-wide mb-4 pb-2 border-b border-gray-300 flex items-center",
    },
    "modern-split": {
      title: "text-[13px] font-semibold text-indigo-600 uppercase tracking-wider mb-3 flex items-center",
    },
    "minimal-elegant": {
      title: "text-xs uppercase tracking-[0.2em] text-black mb-6 font-bold text-center flex items-center justify-center",
    },
    "professional-executive": {
      title: "text-base font-bold text-black uppercase tracking-wide mb-3 pb-1 border-b border-black flex items-center",
    },
    "modern-professional": {
      title: "text-base font-bold text-emerald-700 uppercase tracking-wide mb-3 flex items-center",
    },
  };
  
  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];
  
  const showIcon = template.style.icons.sections;
  
  if (template.id === "modern-split") {
    return (
      <h3 className={currentStyle.title}>
        <span className="flex items-center">
          <span className="inline-block w-4 h-0.5 bg-indigo-500 mr-2"></span>
          {showIcon && getIcon()}
          {title}
        </span>
      </h3>
    );
  }
  
  if (template.id === "minimal-elegant") {
    return (
      <h3 className={currentStyle.title}>
        {showIcon && getIcon()}
        {title}
      </h3>
    );
  }
  
  return (
    <h3 className={currentStyle.title}>
      {showIcon && getIcon()}
      {title}
    </h3>
  );
}
