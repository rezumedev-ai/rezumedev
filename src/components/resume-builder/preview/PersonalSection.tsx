
import { ResumeTemplate } from "../templates";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  template: ResumeTemplate;
}

export function PersonalSection({
  fullName,
  title,
  email,
  phone,
  linkedin,
  template
}: PersonalSectionProps) {
  return (
    <div className={`${template.style.headerStyle}`}>
      <h1 className={`${template.style.titleFont} text-3xl`}>
        {fullName}
      </h1>
      <h2 className="text-xl text-gray-600">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
        <span>{email}</span>
        <span>{phone}</span>
        {linkedin && <span>{linkedin}</span>}
      </div>
    </div>
  );
}
