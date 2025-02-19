
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, MapPin } from "lucide-react";
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
  template,
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
    <div className={template.style.headerStyle}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className={template.style.titleFont}>
            {renderEditableField(fullName, "fullName", "Your Full Name")}
          </h1>
          <div className="text-gray-600 font-medium mt-1 text-lg">
            {renderEditableField(title, "title", "Professional Title")}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-gray-400" />
          {renderEditableField(email, "email", "Email Address")}
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-gray-400" />
          {renderEditableField(phone, "phone", "Phone Number")}
        </div>
        {linkedin && (
          <div className="flex items-center gap-1.5">
            <Linkedin className="w-4 h-4 text-gray-400" />
            {renderEditableField(linkedin, "linkedin", "LinkedIn Profile URL")}
          </div>
        )}
      </div>
    </div>
  );
}
