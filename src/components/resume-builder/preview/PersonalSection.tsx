
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  template: ResumeTemplate;
  isEditing?: boolean;
  onUpdate?: (field: string, value: string) => void;
}

export function PersonalSection({
  fullName,
  title,
  email,
  phone,
  linkedin,
  isEditing,
  onUpdate
}: PersonalSectionProps) {
  const renderEditableField = (value: string, field: string, placeholder: string) => {
    if (!isEditing) return value;

    return (
      <Input
        value={value}
        onChange={(e) => onUpdate?.(field, e.target.value)}
        placeholder={placeholder}
        className="w-full font-normal"
      />
    );
  };

  return (
    <div className="mb-8 text-center border-b border-black pb-6">
      <div className={`text-3xl font-bold text-black mb-2 uppercase tracking-wide ${isEditing ? 'space-y-2' : ''}`}>
        {renderEditableField(fullName, "fullName", "Your Full Name")}
      </div>
      <div className={`text-lg font-semibold text-black mb-3 capitalize ${isEditing ? 'space-y-2' : ''}`}>
        {renderEditableField(title, "title", "Professional Title")}
      </div>
      <div className={`flex flex-wrap justify-center gap-6 text-sm text-black ${isEditing ? 'space-y-2' : ''}`}>
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-center">
          <Mail className="w-3.5 h-3.5 shrink-0" />
          {renderEditableField(email, "email", "Email Address")}
        </div>
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-center">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          {renderEditableField(phone, "phone", "Phone Number")}
        </div>
        <div className="flex items-center gap-1.5 w-full md:w-auto justify-center">
          <Linkedin className="w-3.5 h-3.5 shrink-0" />
          {renderEditableField(linkedin || "", "linkedin", "LinkedIn Profile URL")}
        </div>
      </div>
    </div>
  );
}
