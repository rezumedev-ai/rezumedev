import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";
import { ImageUploadButton } from "./ImageUploadButton";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  profileImageUrl?: string;
  template: ResumeTemplate;
  isEditing?: boolean;
  resumeId?: string;
  onUpdate?: (field: string, value: string) => void;
  onImageUpdate?: (imageUrl: string | null) => void;
}

export function PersonalSection({
  fullName,
  title,
  email,
  phone,
  linkedin,
  website,
  profileImageUrl,
  template,
  isEditing,
  resumeId,
  onUpdate,
  onImageUpdate
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
      container: "mb-10 pb-6 border-b border-black",
      name: "text-[32px] font-semibold tracking-tight text-black",
      title: "text-lg text-black mt-2 font-medium",
      contactContainer: "flex flex-wrap justify-center gap-6 mt-4 text-sm text-black"
    },
    "professional-executive": {
      container: "mb-8",
      name: "text-4xl font-black tracking-wide text-black uppercase mb-2",
      title: "text-xl italic font-light text-gray-600",
      contactContainer: "flex flex-wrap gap-4 mt-2 text-sm text-gray-600"
    },
    "modern-professional": {
      container: "mb-6 grid grid-cols-12 gap-6",
      name: "text-3xl font-bold tracking-tight text-gray-900",
      title: "text-lg text-emerald-700 mt-1 font-medium",
      contactContainer: "grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600",
      imageContainer: "col-span-4 flex justify-center items-center",
      infoContainer: "col-span-8"
    },
    "professional-navy": {
      container: "col-span-12",
      name: "text-3xl font-bold tracking-tight text-white",
      title: "text-lg text-white mt-1 font-light",
      contactContainer: "flex flex-wrap gap-4 mt-3 text-sm text-white",
      imageContainer: "col-span-3 flex justify-center items-center",
      infoContainer: "col-span-9"
    }
  };

  const currentStyle = styles[template.id as keyof typeof styles] || styles["executive-clean"];

  // Special rendering for Professional Navy template
  if (template.id === "professional-navy") {
    return (
      <div className={template.style.headerStyle}>
        <div className={styles["professional-navy"].imageContainer}>
          <div className="w-32 h-32 rounded-full bg-white border-4 border-white overflow-hidden flex items-center justify-center relative">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={`${fullName}'s profile`} 
                className="w-full h-full object-cover"
                style={{aspectRatio: "1/1", objectPosition: "center"}}
              />
            ) : (
              <div className="text-4xl text-[#0F2B5B] font-bold">
                {fullName.split(' ').map(name => name[0]).join('')}
              </div>
            )}
            {isEditing && onImageUpdate && resumeId && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                <ImageUploadButton 
                  resumeId={resumeId} 
                  currentImageUrl={profileImageUrl} 
                  onImageUpdate={onImageUpdate} 
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles["professional-navy"].infoContainer}>
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
          <div className={currentStyle.contactContainer}>
            <div className="flex items-center">
              <span 
                className="outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("email", e)}
              >
                {email}
              </span>
            </div>
            <div className="flex items-center">
              <span 
                className="outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("phone", e)}
              >
                {phone}
              </span>
            </div>
            {linkedin && (
              <div className="flex items-center">
                <span 
                  className="outline-none"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit("linkedin", e)}
                >
                  {linkedin}
                </span>
              </div>
            )}
            {website && (
              <div className="flex items-center">
                <span 
                  className="outline-none"
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
      </div>
    );
  }

  // For all other templates
  return (
    <div className={currentStyle.container}>
      <div className={template.id === "minimal-elegant" ? "text-center" : ""}>
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
      <div className={currentStyle.contactContainer}>
        <span 
          className="outline-none"
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("email", e)}
        >
          {email}
        </span>
        <span 
          className="outline-none"
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleContentEdit("phone", e)}
        >
          {phone}
        </span>
        {linkedin && (
          <span 
            className="outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("linkedin", e)}
          >
            {linkedin}
          </span>
        )}
        {website && (
          <span 
            className="outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("website", e)}
          >
            {website}
          </span>
        )}
      </div>
    </div>
  );
}
