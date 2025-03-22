
import { useState } from "react";
import { EditableContent } from "../ui/EditableContent";
import { ResumeTemplate } from "../templates";
import { Mail, Phone, Linkedin, Globe, Upload, Building, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileImageButton } from "./ProfileImageButton";
import { ContactIcon } from "../ui/ContactIcon";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
  location?: string;
  company?: string;
  profileImageUrl?: string | null;
  template: ResumeTemplate;
  isEditing: boolean;
  resumeId: string;
  onUpdate: (field: string, value: string) => void;
  onImageUpdate?: (imageUrl: string | null) => void;
}

export function PersonalSection({
  fullName,
  title,
  email,
  phone,
  linkedin,
  website,
  location,
  company,
  profileImageUrl,
  template,
  isEditing,
  resumeId,
  onUpdate,
  onImageUpdate
}: PersonalSectionProps) {
  const [hovering, setHovering] = useState(false);
  
  const renderContactItem = (icon: JSX.Element, value: string, field: string) => {
    if (!value) return null;
    
    return (
      <div className="flex items-center">
        <ContactIcon template={template.id}>
          {icon}
        </ContactIcon>
        <EditableContent
          value={value}
          onChange={(newValue) => onUpdate(field, newValue)}
          isEditing={isEditing}
          className="text-gray-600"
        />
      </div>
    );
  };

  // Modern Split layout has a unique header style
  if (template.id === "modern-split") {
    return (
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <div>
          <EditableContent
            value={fullName}
            onChange={(value) => onUpdate("fullName", value)}
            isEditing={isEditing}
            className="font-bold text-lg text-gray-900"
          />
          <EditableContent
            value={title}
            onChange={(value) => onUpdate("title", value)}
            isEditing={isEditing}
            className="text-sm text-gray-600 mt-1"
          />
        </div>
        
        <div className="flex flex-col gap-1 text-[10px]">
          {renderContactItem(<Mail className="w-3 h-3 text-gray-600" />, email, "email")}
          {renderContactItem(<Phone className="w-3 h-3 text-gray-600" />, phone, "phone")}
          {linkedin && renderContactItem(<Linkedin className="w-3 h-3 text-gray-600" />, linkedin, "linkedin")}
          {website && renderContactItem(<Globe className="w-3 h-3 text-gray-600" />, website, "website")}
        </div>
      </div>
    );
  }
  
  // Professional Navy template
  if (template.id === "professional-navy") {
    return (
      <div className="relative bg-[#0F2B5B] text-white p-6 pb-3">
        <div className="flex justify-between">
          <div>
            <EditableContent
              value={fullName}
              onChange={(value) => onUpdate("fullName", value)}
              isEditing={isEditing}
              className="font-bold text-xl md:text-2xl"
            />
            <EditableContent
              value={title}
              onChange={(value) => onUpdate("title", value)}
              isEditing={isEditing}
              className="text-sm md:text-base mt-1 text-gray-100"
            />
          </div>
          
          {template.style.layout.profileImage && (
            <div 
              className="relative w-16 h-16"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <ProfileImageButton
                imageUrl={profileImageUrl}
                isEditing={isEditing}
                onUpdate={onImageUpdate}
                resumeId={resumeId}
                className="rounded-full overflow-hidden"
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-gray-100 text-xs">
          {renderContactItem(<Mail className="w-3 h-3 text-gray-100" />, email, "email")}
          {renderContactItem(<Phone className="w-3 h-3 text-gray-100" />, phone, "phone")}
          {linkedin && renderContactItem(<Linkedin className="w-3 h-3 text-gray-100" />, linkedin, "linkedin")}
          {website && renderContactItem(<Globe className="w-3 h-3 text-gray-100" />, website, "website")}
        </div>
      </div>
    );
  }
  
  // Modern Professional template has profile image on left and info on right
  if (template.id === "modern-professional") {
    return (
      <div className="flex items-center mb-4 p-6 bg-gray-50 rounded-lg">
        {template.style.layout.profileImage && (
          <div 
            className="relative w-24 h-24 mr-6"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <ProfileImageButton
              imageUrl={profileImageUrl}
              isEditing={isEditing}
              onUpdate={onImageUpdate}
              resumeId={resumeId}
              className="rounded-full overflow-hidden border-2 border-emerald-500"
            />
          </div>
        )}
        
        <div className="flex-1">
          <EditableContent
            value={fullName}
            onChange={(value) => onUpdate("fullName", value)}
            isEditing={isEditing}
            className="font-bold text-2xl md:text-3xl text-gray-900"
          />
          <EditableContent
            value={title}
            onChange={(value) => onUpdate("title", value)}
            isEditing={isEditing}
            className="text-lg text-emerald-600 font-medium mt-1"
          />
          
          <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2">
            {renderContactItem(<Mail className="w-4 h-4 text-gray-500" />, email, "email")}
            {renderContactItem(<Phone className="w-4 h-4 text-gray-500" />, phone, "phone")}
            {linkedin && renderContactItem(<Linkedin className="w-4 h-4 text-gray-500" />, linkedin, "linkedin")}
            {website && renderContactItem(<Globe className="w-4 h-4 text-gray-500" />, website, "website")}
          </div>
        </div>
      </div>
    );
  }
  
  // Default template style
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200">
      <div>
        <EditableContent
          value={fullName}
          onChange={(value) => onUpdate("fullName", value)}
          isEditing={isEditing}
          className="font-bold text-2xl md:text-3xl text-gray-900"
        />
        <EditableContent
          value={title}
          onChange={(value) => onUpdate("title", value)}
          isEditing={isEditing}
          className="text-lg text-gray-600 mt-1"
        />
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
          {renderContactItem(<Mail className="w-4 h-4 text-gray-500" />, email, "email")}
          {renderContactItem(<Phone className="w-4 h-4 text-gray-500" />, phone, "phone")}
          {linkedin && renderContactItem(<Linkedin className="w-4 h-4 text-gray-500" />, linkedin, "linkedin")}
          {website && renderContactItem(<Globe className="w-4 h-4 text-gray-500" />, website, "website")}
          {location && renderContactItem(<MapPin className="w-4 h-4 text-gray-500" />, location, "location")}
          {company && renderContactItem(<Building className="w-4 h-4 text-gray-500" />, company, "company")}
        </div>
      </div>
      
      {template.style.layout.profileImage && (
        <div 
          className="relative w-24 h-24 mt-4 md:mt-0"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <ProfileImageButton
            imageUrl={profileImageUrl}
            isEditing={isEditing}
            onUpdate={onImageUpdate}
            resumeId={resumeId}
            className="rounded-full overflow-hidden"
          />
        </div>
      )}
    </div>
  );
}
