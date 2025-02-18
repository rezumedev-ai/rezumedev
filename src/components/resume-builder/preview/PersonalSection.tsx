
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, MapPin } from "lucide-react";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  location?: string;
  template: ResumeTemplate;
}

export function PersonalSection({
  fullName,
  title,
  email,
  phone,
  linkedin,
  location,
  template
}: PersonalSectionProps) {
  const ContactInfo = () => (
    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
      {template.style.icons.contact ? (
        <>
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
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {location}
            </span>
          )}
        </>
      ) : (
        <>
          <span>{email}</span>
          <span>{phone}</span>
          {linkedin && <span>{linkedin}</span>}
          {location && <span>{location}</span>}
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch (template.style.layout) {
      case "two-column":
        return (
          <div className={template.style.headerStyle}>
            <div className="space-y-1">
              <h1 className={template.style.titleFont}>{fullName}</h1>
              <ContactInfo />
            </div>
            <div>
              <h2 className="text-xl text-gray-700 mb-4">{title}</h2>
            </div>
          </div>
        );
      case "grid":
        return (
          <div className={template.style.headerStyle}>
            <div>
              <h1 className={template.style.titleFont}>{fullName}</h1>
              <h2 className="text-xl text-gray-600 mt-2">{title}</h2>
            </div>
            <div className="self-end">
              <ContactInfo />
            </div>
          </div>
        );
      case "minimal":
        return (
          <div className={template.style.headerStyle}>
            <h1 className={template.style.titleFont}>{fullName}</h1>
            <h2 className="text-xl tracking-wide text-gray-600">{title}</h2>
            <ContactInfo />
          </div>
        );
      default:
        return (
          <div className={template.style.headerStyle}>
            <h1 className={template.style.titleFont}>{fullName}</h1>
            <h2 className="text-xl text-gray-700">{title}</h2>
            <ContactInfo />
          </div>
        );
    }
  };

  return renderContent();
}
