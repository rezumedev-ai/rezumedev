import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
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
  website,
  template,
  isEditing,
  onUpdate
}: PersonalSectionProps) {
  const handleContentEdit = (field: string, event: React.FocusEvent<HTMLElement>) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(field, newValue);
  };

  const styles = {
    "executive-clean": {
      container: "mb-10 pb-6 border-b-2 border-gray-800",
      name: "text-4xl font-bold tracking-tight text-gray-900",
      title: "text-xl text-gray-600 mt-2",
      contactContainer: "flex flex-wrap gap-4 mt-3 text-sm text-gray-600"
    },
    "modern-split": {
      container: "mb-4 pb-2 border-b border-gray-300",
      name: "text-[28px] font-bold text-gray-900 tracking-tight leading-tight",
      title: "text-base text-gray-700 mt-1 font-medium",
      contactContainer: "flex flex-wrap gap-3 mt-2 text-xs text-gray-600"
    },
    "minimal-elegant": {
      container: "mb-10 text-center border-b border-gray-200 pb-6",
      name: "text-4xl font-extralight tracking-tight text-gray-900",
      title: "text-xl text-gray-500 mt-2 font-light",
      contactContainer: "flex justify-center gap-6 mt-3 text-sm text-gray-500"
    },
    "professional-executive": {
      container: "mb-8",
      name: "text-4xl font-black tracking-wide text-black uppercase mb-2",
      title: "text-xl italic font-light text-gray-600",
      contactContainer: "flex flex-wrap gap-4 mt-2 text-sm text-gray-600"
    },
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  if (template.id === "modern-split") {
    return (
      <div className={currentStyle.container}>
        <h1 
          className={`${currentStyle.name} outline-none`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("fullName", e)}
        >
          {fullName}
        </h1>
        <div 
          className={`${currentStyle.title} outline-none`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("title", e)}
        >
          {title}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-gray-500" />
            <span 
              className="text-xs text-gray-600 outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("email", e)}
            >
              {email}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-gray-500" />
            <span 
              className="text-xs text-gray-600 outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("phone", e)}
            >
              {phone}
            </span>
          </div>
          {linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-gray-500" />
              <span 
                className="text-xs text-gray-600 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("linkedin", e)}
              >
                {linkedin}
              </span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-gray-500" />
              <span 
                className="text-xs text-gray-600 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("website", e)}
              >
                {website}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderContact = () => {
    if (template.id === "minimal-elegant") {
      return (
        <div className={currentStyle.contactContainer}>
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("email", e)}
            className="outline-none"
          >
            {email}
          </span>
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("phone", e)}
            className="outline-none"
          >
            {phone}
          </span>
          {linkedin && (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("linkedin", e)}
              className="outline-none"
            >
              {linkedin}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className={currentStyle.contactContainer}>
        <div className="flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-gray-400" />
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("email", e)}
            className="outline-none"
          >
            {email}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="w-4 h-4 text-gray-400" />
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("phone", e)}
            className="outline-none"
          >
            {phone}
          </div>
        </div>
        {linkedin && (
          <div className="flex items-center gap-1.5">
            <Linkedin className="w-4 h-4 text-gray-400" />
            <div
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("linkedin", e)}
              className="outline-none"
            >
              {linkedin}
            </div>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-gray-400" />
            <div
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("website", e)}
              className="outline-none"
            >
              {website}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={currentStyle.container}>
      <div className={template.id === "modern-split" ? "flex-1" : ""}>
        <h1 
          className={`${currentStyle.name} outline-none`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("fullName", e)}
        >
          {fullName}
        </h1>
        <div 
          className={`${currentStyle.title} outline-none`}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("title", e)}
        >
          {title}
        </div>
      </div>
      
      {renderContact()}
    </div>
  );
}
