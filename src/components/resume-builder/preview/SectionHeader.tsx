
import { ResumeTemplate } from "../templates";
import { SectionIcon } from "../ui/SectionIcon";

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
          {type && <SectionIcon type={type} template={template} />}
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  if (template.id === "professional-navy") {
    return (
      <h3 className={template.style.sectionStyle}>
        <div className="flex items-center">
          {type && <SectionIcon type={type} template={template} />}
          <span>{title}</span>
        </div>
      </h3>
    );
  }

  return (
    <h3 className={template.style.sectionStyle}>
      <div className="flex items-center">
        {type && <SectionIcon type={type} template={template} />}
        <span>{title}</span>
      </div>
    </h3>
  );
}
