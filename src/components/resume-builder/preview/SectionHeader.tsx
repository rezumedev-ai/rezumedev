
import { ResumeTemplate } from "../templates";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  type?: "experience" | "education" | "skills" | "certifications" | "summary" | "profile" | "projects";
  template: ResumeTemplate;
}

export function SectionHeader({ title, type, template }: SectionHeaderProps) {
  if (template.id === "modern-professional") {
    return (
      <h3 className={template.style.sectionStyle}>
        <div className="flex items-center after:content-[''] after:block after:h-0.5 after:flex-grow after:ml-2 after:bg-emerald-500">
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  if (template.id === "professional-navy") {
    return (
      <h3 className={template.style.sectionStyle}>
        <div className="flex items-center">
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  if (template.id === "modern-split") {
    return (
      <h3 className={template.style.sectionStyle}>
        <span className="flex items-center">
          <span className="inline-block w-2 h-0.5 bg-gray-400 mr-1"></span>
          <span>{title}</span>
        </span>
      </h3>
    );
  }

  return (
    <h3 className={cn(template.style.sectionStyle)}>
      <div className="flex items-center">
        <span>{title}</span>
      </div>
    </h3>
  );
}
