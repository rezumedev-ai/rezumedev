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
            <div className="flex items-center gap-2 contact-item">
              <Mail className="w-4 h-4 text-white professional-navy-contact-icon contact-icon" />
              <span 
                className="outline-none contact-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("email", e)}
              >
                {email}
              </span>
            </div>
            <div className="flex items-center gap-2 contact-item">
              <Phone className="w-4 h-4 text-white professional-navy-contact-icon contact-icon" />
              <span 
                className="outline-none contact-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("phone", e)}
              >
                {phone}
              </span>
            </div>
            {linkedin && (
              <div className="flex items-center gap-2 contact-item">
                <Linkedin className="w-4 h-4 text-white professional-navy-contact-icon contact-icon" />
                <span 
                  className="outline-none contact-text"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit("linkedin", e)}
                >
                  {linkedin}
                </span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 contact-item">
                <Globe className="w-4 h-4 text-white professional-navy-contact-icon contact-icon" />
                <span 
                  className="outline-none contact-text"
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

  if (template.id === "modern-professional") {
    return (
      <div className={currentStyle.container}>
        <div className={styles["modern-professional"].imageContainer}>
          <div className="w-40 h-40 rounded-full bg-emerald-100 border-4 border-emerald-500 overflow-hidden flex items-center justify-center relative">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt={`${fullName}'s profile`} 
                className="w-full h-full object-cover"
                style={{aspectRatio: "1/1", objectPosition: "center"}}
              />
            ) : (
              <div className="text-5xl text-emerald-700 font-bold">
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
        <div className={styles["modern-professional"].infoContainer}>
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
            <div className="flex items-center gap-2 contact-item">
              <Mail className="w-4 h-4 text-emerald-600 contact-icon" />
              <span 
                className="outline-none contact-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("email", e)}
              >
                {email}
              </span>
            </div>
            <div className="flex items-center gap-2 contact-item">
              <Phone className="w-4 h-4 text-emerald-600 contact-icon" />
              <span 
                className="outline-none contact-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("phone", e)}
              >
                {phone}
              </span>
            </div>
            {linkedin && (
              <div className="flex items-center gap-2 contact-item">
                <Linkedin className="w-4 h-4 text-emerald-600 contact-icon" />
                <span 
                  className="outline-none contact-text"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit("linkedin", e)}
                >
                  {linkedin}
                </span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 contact-item">
                <Globe className="w-4 h-4 text-emerald-600 contact-icon" />
                <span 
                  className="outline-none contact-text"
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
          <div className="flex items-center gap-1 contact-item">
            <Mail className="w-3 h-3 text-gray-500 contact-icon" />
            <span 
              className="text-xs text-gray-600 outline-none contact-text"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("email", e)}
            >
              {email}
            </span>
          </div>
          <div className="flex items-center gap-1 contact-item">
            <Phone className="w-3 h-3 text-gray-500 contact-icon" />
            <span 
              className="text-xs text-gray-600 outline-none contact-text"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("phone", e)}
            >
              {phone}
            </span>
          </div>
          {linkedin && (
            <div className="flex items-center gap-1 contact-item">
              <Linkedin className="w-3 h-3 text-gray-500 contact-icon" />
              <span 
                className="text-xs text-gray-600 outline-none contact-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("linkedin", e)}
              >
                {linkedin}
              </span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-1 contact-item">
              <Globe className="w-3 h-3 text-gray-500 contact-icon" />
              <span 
                className="text-xs text-gray-600 outline-none contact-text"
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
          <div className="flex items-center gap-2 contact-item">
            <Mail className="w-4 h-4 text-black contact-icon" />
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("email", e)}
              className="outline-none contact-text"
            >
              {email}
            </span>
          </div>
          <div className="flex items-center gap-2 contact-item">
            <Phone className="w-4 h-4 text-black contact-icon" />
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("phone", e)}
              className="outline-none contact-text"
            >
              {phone}
            </span>
          </div>
          {linkedin && (
            <div className="flex items-center gap-2 contact-item">
              <Linkedin className="w-4 h-4 text-black contact-icon" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("linkedin", e)}
                className="outline-none contact-text"
              >
                {linkedin}
              </span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2 contact-item">
              <Globe className="w-4 h-4 text-black contact-icon" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit("website", e)}
                className="outline-none contact-text"
              >
                {website}
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={currentStyle.contactContainer}>
        <div className="flex items-center gap-1.5 contact-item">
          <Mail className="w-4 h-4 text-gray-400 contact-icon" />
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("email", e)}
            className="outline-none contact-text"
          >
            {email}
          </div>
        </div>
        <div className="flex items-center gap-1.5 contact-item">
          <Phone className="w-4 h-4 text-gray-400 contact-icon" />
          <div
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit("phone", e)}
            className="outline-none contact-text"
          >
            {phone}
          </div>
        </div>
        {linkedin && (
          <div className="flex items-center gap-1.5 contact-item">
            <Linkedin className="w-4 h-4 text-gray-400 contact-icon" />
            <div
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("linkedin", e)}
              className="outline-none contact-text"
            >
              {linkedin}
            </div>
          </div>
        )}
        {website && (
          <div className="flex items-center gap-1.5 contact-item">
            <Globe className="w-4 h-4 text-gray-400 contact-icon" />
            <div
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit("website", e)}
              className="outline-none contact-text"
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
      
      {renderContact()}
    </div>
  );
}
