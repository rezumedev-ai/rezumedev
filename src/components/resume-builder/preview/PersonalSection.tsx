
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
    <div className="mb-8 text-center border-b border-black pb-6">
      <h1 className="text-3xl font-bold text-black mb-2 uppercase tracking-wide">
        {fullName}
      </h1>
      <h2 className="text-lg font-semibold text-black mb-3 capitalize">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center gap-6 text-sm text-black">
        <span className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" /> {email}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" /> {phone}
        </span>
        {linkedin && (
          <span className="flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5" /> {linkedin}
          </span>
        )}
      </div>
    </div>
  );
}
