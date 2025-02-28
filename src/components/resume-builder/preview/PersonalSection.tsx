
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
  const handleContentEdit = (field: string, event: React.FocusEvent<HTMLDivElement>) => {
    if (!isEditing || !onUpdate) return;
    const newValue = event.target.innerText.trim();
    onUpdate(field, newValue);
  };

  // Dynamic styles based on template
  const styles = {
    "executive-clean": {
      container: "mb-10 pb-6 border-b-2 border-gray-800",
      name: "text-4xl font-bold tracking-tight text-gray-900",
      title: "text-xl text-gray-600 mt-2",
      contactContainer: "flex flex-wrap gap-4 mt-3 text-sm text-gray-600"
    },
    "modern-split": {
      container: "mb-7 flex justify-between items-start",
      name: "text-3xl font-light tracking-wide text-indigo-700",
      title: "text-lg text-gray-600 mt-1 font-light",
      contactContainer: "flex flex-col items-end gap-1 text-xs"
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

  const renderContact = () => {
    if (template.id === "modern-split") {
      return (
        <div className={currentStyle.contactContainer}>
          <div className="flex items-center justify-end gap-2">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("email", e)}
              className="outline-none"
            >
              {email}
            </span>
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("phone", e)}
              className="outline-none"
            >
              {phone}
            </span>
            <Phone className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          {linkedin && (
            <div className="flex items-center justify-end gap-2">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("linkedin", e)}
                className="outline-none"
              >
                {linkedin}
              </span>
              <Linkedin className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          )}
          {website && (
            <div className="flex items-center justify-end gap-2">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("website", e)}
                className="outline-none"
              >
                {website}
              </span>
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          )}
        </div>
      );
    }

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

    // Default format (executive-clean and others)
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
