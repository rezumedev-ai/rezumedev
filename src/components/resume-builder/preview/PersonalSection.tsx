import { ChangeEvent, useEffect, useState } from "react";
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, Globe, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface PersonalSectionProps {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    website?: string;
    profileImageUrl?: string;
  };
  isEditing: boolean;
  template: ResumeTemplate;
  onUpdate: (field: string, value: string) => void;
}

export function PersonalSection({
  personalInfo,
  isEditing,
  template,
  onUpdate,
}: PersonalSectionProps) {
  const [editableValue, setEditableValue] = useState({
    fullName: personalInfo.fullName || "",
    email: personalInfo.email || "",
    phone: personalInfo.phone || "",
    location: personalInfo.location || "",
    linkedin: personalInfo.linkedin || "",
    website: personalInfo.website || ""
  });
  
  useEffect(() => {
    setEditableValue({
      fullName: personalInfo.fullName || "",
      email: personalInfo.email || "",
      phone: personalInfo.phone || "",
      location: personalInfo.location || "",
      linkedin: personalInfo.linkedin || "",
      website: personalInfo.website || ""
    });
  }, [personalInfo, isEditing]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableValue(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    if (editableValue[field as keyof typeof editableValue] !== personalInfo[field as keyof typeof personalInfo]) {
      onUpdate(field, editableValue[field as keyof typeof editableValue]);
    }
  };

  const handleContentEditableBlur = (field: string, e: React.FocusEvent<HTMLSpanElement>) => {
    const content = e.target.textContent || "";
    if (content !== String(personalInfo[field as keyof typeof personalInfo] || "")) {
      onUpdate(field, content);
    }
  };

  // Get styling based on template
  const getHeaderStyle = () => {
    const styles = {
      "executive-clean": "mb-7",
      "modern-split": "mb-6 flex flex-col items-center text-center",
      "minimal-elegant": "mb-8 flex flex-col items-center text-center",
      "professional-executive": "mb-6",
      "modern-professional": "mb-6 grid grid-cols-12 gap-6 items-center",
    };
    
    return styles[template.id as keyof typeof styles] || styles["executive-clean"];
  };

  const getNameStyle = () => {
    const styles = {
      "executive-clean": "text-[2.5rem] font-bold text-gray-800 leading-tight",
      "modern-split": "text-[1.8rem] font-bold text-gray-900 leading-tight mt-2",
      "minimal-elegant": "text-[2rem] font-bold text-black tracking-tight",
      "professional-executive": "text-[2.5rem] font-black tracking-wide text-black uppercase mt-1 transform -translate-y-1",
      "modern-professional": "text-[2.2rem] font-bold text-gray-900 leading-tight",
    };
    
    return styles[template.id as keyof typeof styles] || styles["executive-clean"];
  };

  const getTitleStyle = () => {
    const styles = {
      "executive-clean": "text-xl text-gray-600 mt-2",
      "modern-split": "text-md text-indigo-600 font-medium mt-1 mb-2",
      "minimal-elegant": "text-base text-gray-700 mt-1 uppercase tracking-wider text-center",
      "professional-executive": "text-md text-gray-700 mt-1 font-medium uppercase tracking-wider", 
      "modern-professional": "text-lg text-emerald-600 font-medium",
    };
    
    return styles[template.id as keyof typeof styles] || styles["executive-clean"];
  };

  const getContactSectionStyle = () => {
    const styles = {
      "executive-clean": "flex flex-wrap gap-4 text-sm text-gray-600 mt-3",
      "modern-split": "flex flex-wrap justify-center gap-3 text-sm text-gray-600 mt-3",
      "minimal-elegant": "flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-4",
      "professional-executive": "flex flex-wrap gap-5 text-sm text-gray-600 mt-3", 
      "modern-professional": "text-sm text-gray-600 space-y-1.5",
    };
    
    return styles[template.id as keyof typeof styles] || styles["executive-clean"];
  };

  const getContactItemStyle = () => {
    return "flex items-center";
  };

  // Handle the different layouts for the profile image
  const showCircularImage = template.style.icons.circularImage;

  // Determine if we're using a two-column layout for Modern Professional
  const isTwoColumnHeader = template.id === "modern-professional";
  
  // Common contact info content
  const contactInfoContent = (
    <div className={getContactSectionStyle()}>
      {personalInfo.email && (
        <div className={getContactItemStyle()}>
          <Mail size={16} className="text-gray-500 mr-1.5 inline-flex items-center" />
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editableValue.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur("email")}
              className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
            />
          ) : (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableBlur("email", e)}
              className="outline-none"
            >
              {personalInfo.email}
            </span>
          )}
        </div>
      )}
      
      {personalInfo.phone && (
        <div className={getContactItemStyle()}>
          <Phone size={16} className="text-gray-500 mr-1.5 inline-flex items-center" />
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={editableValue.phone}
              onChange={handleInputChange}
              onBlur={() => handleBlur("phone")}
              className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
            />
          ) : (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableBlur("phone", e)}
              className="outline-none"
            >
              {personalInfo.phone}
            </span>
          )}
        </div>
      )}
      
      {personalInfo.location && (
        <div className={getContactItemStyle()}>
          <MapPin size={16} className="text-gray-500 mr-1.5 inline-flex items-center" />
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editableValue.location}
              onChange={handleInputChange}
              onBlur={() => handleBlur("location")}
              className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
            />
          ) : (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableBlur("location", e)}
              className="outline-none"
            >
              {personalInfo.location}
            </span>
          )}
        </div>
      )}
      
      {personalInfo.linkedin && (
        <div className={getContactItemStyle()}>
          <Linkedin size={16} className="text-gray-500 mr-1.5 inline-flex items-center" />
          {isEditing ? (
            <input
              type="text"
              name="linkedin"
              value={editableValue.linkedin}
              onChange={handleInputChange}
              onBlur={() => handleBlur("linkedin")}
              className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
            />
          ) : (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableBlur("linkedin", e)}
              className="outline-none"
            >
              {personalInfo.linkedin}
            </span>
          )}
        </div>
      )}
      
      {personalInfo.website && (
        <div className={getContactItemStyle()}>
          <Globe size={16} className="text-gray-500 mr-1.5 inline-flex items-center" />
          {isEditing ? (
            <input
              type="text"
              name="website"
              value={editableValue.website}
              onChange={handleInputChange}
              onBlur={() => handleBlur("website")}
              className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
            />
          ) : (
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEditableBlur("website", e)}
              className="outline-none"
            >
              {personalInfo.website}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (isTwoColumnHeader) {
    // Modern Professional template layout (two columns)
    return (
      <header className={getHeaderStyle()}>
        <div className="col-span-4 flex justify-center">
          {personalInfo.profileImageUrl && (
            <div className={`rounded-full overflow-hidden w-[140px] h-[140px] border-4 border-emerald-100 ${isEditing ? 'cursor-pointer' : ''}`}>
              <img 
                src={personalInfo.profileImageUrl} 
                alt={personalInfo.fullName}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}
        </div>
        
        <div className="col-span-8">
          <h1 className={getNameStyle()}>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={editableValue.fullName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("fullName")}
                className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
              />
            ) : (
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentEditableBlur("fullName", e)}
                className="outline-none"
              >
                {personalInfo.fullName}
              </span>
            )}
          </h1>
          <div className={getTitleStyle()}>
            <span>Civil Engineer</span>
          </div>
          
          {contactInfoContent}
        </div>
      </header>
    );
  }
  
  // Other templates - standard layout
  return (
    <header className={getHeaderStyle()}>
      {personalInfo.profileImageUrl && (showCircularImage || template.id === "minimal-elegant" || template.id === "modern-split") && (
        <div className={`rounded-full overflow-hidden ${
          template.id === "minimal-elegant" ? 'w-[120px] h-[120px] mb-4' : 
          template.id === "modern-split" ? 'w-[100px] h-[100px] mb-2' : 
          'w-[140px] h-[140px] mx-auto mb-4'
        } ${isEditing ? 'cursor-pointer' : ''}`}>
          <img 
            src={personalInfo.profileImageUrl} 
            alt={personalInfo.fullName}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      
      <h1 className={getNameStyle()}>
        {isEditing ? (
          <input
            type="text"
            name="fullName"
            value={editableValue.fullName}
            onChange={handleInputChange}
            onBlur={() => handleBlur("fullName")}
            className="bg-transparent border-b border-dashed border-gray-300 outline-none px-0.5 w-full"
          />
        ) : (
          <span
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEditableBlur("fullName", e)}
            className="outline-none"
          >
            {personalInfo.fullName}
          </span>
        )}
      </h1>
      
      <div className={getTitleStyle()}>
        <span>Civil Engineer</span>
      </div>
      
      {contactInfoContent}
    </header>
  );
}
