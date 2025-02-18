
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin } from "lucide-react";

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
  linkedin
}: PersonalSectionProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-black mb-1">{fullName}</h1>
      <h2 className="text-lg font-medium text-black mb-2">{title}</h2>
      <div className="flex flex-wrap gap-4 text-sm text-black">
        <span className="flex items-center gap-1">
          <Mail className="w-4 h-4" /> {email}
        </span>
        <span className="flex items-center gap-1">
          <Phone className="w-4 h-4" /> {phone}
        </span>
        {linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="w-4 h-4" /> {linkedin}
          </span>
        )}
      </div>
    </div>
  );
}
