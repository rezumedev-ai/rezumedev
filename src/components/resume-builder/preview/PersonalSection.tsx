
import { EditableContent } from "../ui/EditableContent";
import { ResumeTemplate } from "../templates";
import { ProfileImageButton } from "./ProfileImageButton";
import { Mail, Phone, Globe, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalSectionProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  website?: string;
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
  profileImageUrl,
  template,
  isEditing,
  resumeId,
  onUpdate,
  onImageUpdate
}: PersonalSectionProps) {
  
  const renderProfessionalNavyHeader = () => {
    return (
      <div className={template.style.headerStyle}>
        <div className="col-span-3 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white/80">
            {isEditing && onImageUpdate ? (
              <ProfileImageButton
                profileImageUrl={profileImageUrl || undefined}
                resumeId={resumeId}
                onImageUpdate={onImageUpdate}
              />
            ) : (
              profileImageUrl ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={profileImageUrl} 
                    alt={`${fullName}'s profile`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="text-3xl font-light">
                    {fullName.charAt(0)}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        
        <div className="col-span-9 pl-4">
          <EditableContent
            value={fullName}
            placeholder="Your Full Name"
            isEditing={isEditing}
            onChange={(value) => onUpdate('fullName', value)}
            className={template.style.titleFont}
          />
          
          <EditableContent
            value={title}
            placeholder="Your Professional Title"
            isEditing={isEditing}
            onChange={(value) => onUpdate('title', value)}
            className="text-white text-xl mt-1 font-medium"
          />
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/90">
            <div className="flex items-center gap-2 contact-info-item">
              <span className="professional-navy-contact-icon">
                <Mail className="w-4 h-4" />
              </span>
              <EditableContent
                value={email}
                placeholder="your.email@example.com"
                isEditing={isEditing}
                onChange={(value) => onUpdate('email', value)}
                className="text-white"
              />
            </div>
            
            <div className="flex items-center gap-2 contact-info-item">
              <span className="professional-navy-contact-icon">
                <Phone className="w-4 h-4" />
              </span>
              <EditableContent
                value={phone}
                placeholder="+1 (555) 123-4567"
                isEditing={isEditing}
                onChange={(value) => onUpdate('phone', value)}
                className="text-white"
              />
            </div>
            
            {(linkedin || isEditing) && (
              <div className="flex items-center gap-2 contact-info-item">
                <span className="professional-navy-contact-icon">
                  <Linkedin className="w-4 h-4" />
                </span>
                <EditableContent
                  value={linkedin || ''}
                  placeholder="linkedin.com/in/yourprofile"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('linkedin', value)}
                  className="text-white"
                />
              </div>
            )}
            
            {(website || isEditing) && (
              <div className="flex items-center gap-2 contact-info-item">
                <span className="professional-navy-contact-icon">
                  <Globe className="w-4 h-4" />
                </span>
                <EditableContent
                  value={website || ''}
                  placeholder="yourwebsite.com"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('website', value)}
                  className="text-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderModernProfessionalHeader = () => {
    const hasCircularImage = template.style.icons.circularImage;
    
    return (
      <div className={template.style.headerStyle}>
        {hasCircularImage && (
          <div className="col-span-3 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              {isEditing && onImageUpdate ? (
                <ProfileImageButton
                  profileImageUrl={profileImageUrl || undefined}
                  resumeId={resumeId}
                  onImageUpdate={onImageUpdate}
                />
              ) : (
                profileImageUrl ? (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={profileImageUrl} 
                      alt={`${fullName}'s profile`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-3xl font-light">
                      {fullName.charAt(0)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        
        <div className={cn(hasCircularImage ? "col-span-9 pl-4" : "col-span-12")}>
          <EditableContent
            value={fullName}
            placeholder="Your Full Name"
            isEditing={isEditing}
            onChange={(value) => onUpdate('fullName', value)}
            className={template.style.titleFont}
          />
          
          <EditableContent
            value={title}
            placeholder="Your Professional Title"
            isEditing={isEditing}
            onChange={(value) => onUpdate('title', value)}
            className="text-emerald-700 text-xl mt-1 font-medium"
          />
          
          <div className="flex flex-wrap gap-4 mt-3 text-gray-600">
            <div className="flex items-center gap-2 contact-info-item">
              <span className="contact-info-icon text-emerald-700">
                <Mail className="w-4 h-4" />
              </span>
              <EditableContent
                value={email}
                placeholder="your.email@example.com"
                isEditing={isEditing}
                onChange={(value) => onUpdate('email', value)}
              />
            </div>
            
            <div className="flex items-center gap-2 contact-info-item">
              <span className="contact-info-icon text-emerald-700">
                <Phone className="w-4 h-4" />
              </span>
              <EditableContent
                value={phone}
                placeholder="+1 (555) 123-4567"
                isEditing={isEditing}
                onChange={(value) => onUpdate('phone', value)}
              />
            </div>
            
            {(linkedin || isEditing) && (
              <div className="flex items-center gap-2 contact-info-item">
                <span className="contact-info-icon text-emerald-700">
                  <Linkedin className="w-4 h-4" />
                </span>
                <EditableContent
                  value={linkedin || ''}
                  placeholder="linkedin.com/in/yourprofile"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('linkedin', value)}
                />
              </div>
            )}
            
            {(website || isEditing) && (
              <div className="flex items-center gap-2 contact-info-item">
                <span className="contact-info-icon text-emerald-700">
                  <Globe className="w-4 h-4" />
                </span>
                <EditableContent
                  value={website || ''}
                  placeholder="yourwebsite.com"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('website', value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Standard header for most templates
  const renderStandardHeader = () => {
    return (
      <div className={template.style.headerStyle}>
        <div className="flex items-center mb-3">
          {(profileImageUrl || (isEditing && onImageUpdate)) && (
            <div className="mr-6">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100">
                {isEditing && onImageUpdate ? (
                  <ProfileImageButton
                    profileImageUrl={profileImageUrl || undefined}
                    resumeId={resumeId}
                    onImageUpdate={onImageUpdate}
                  />
                ) : (
                  profileImageUrl ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img 
                        src={profileImageUrl} 
                        alt={`${fullName}'s profile`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
          
          <div>
            <EditableContent
              value={fullName}
              placeholder="Your Full Name"
              isEditing={isEditing}
              onChange={(value) => onUpdate('fullName', value)}
              className={template.style.titleFont}
            />
            
            <EditableContent
              value={title}
              placeholder="Your Professional Title"
              isEditing={isEditing}
              onChange={(value) => onUpdate('title', value)}
              className="text-xl text-gray-600 mt-1"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-2 contact-info-item">
            <span className="contact-info-icon">
              <Mail className="w-4 h-4" />
            </span>
            <EditableContent
              value={email}
              placeholder="your.email@example.com"
              isEditing={isEditing}
              onChange={(value) => onUpdate('email', value)}
            />
          </div>
          
          <div className="flex items-center gap-2 contact-info-item">
            <span className="contact-info-icon">
              <Phone className="w-4 h-4" />
            </span>
            <EditableContent
              value={phone}
              placeholder="+1 (555) 123-4567"
              isEditing={isEditing}
              onChange={(value) => onUpdate('phone', value)}
            />
          </div>
          
          {(linkedin || isEditing) && (
            <div className="flex items-center gap-2 contact-info-item">
              <span className="contact-info-icon">
                <Linkedin className="w-4 h-4" />
              </span>
              <EditableContent
                value={linkedin || ''}
                placeholder="linkedin.com/in/yourprofile"
                isEditing={isEditing}
                onChange={(value) => onUpdate('linkedin', value)}
              />
            </div>
          )}
          
          {(website || isEditing) && (
            <div className="flex items-center gap-2 contact-info-item">
              <span className="contact-info-icon">
                <Globe className="w-4 h-4" />
              </span>
              <EditableContent
                value={website || ''}
                placeholder="yourwebsite.com"
                isEditing={isEditing}
                onChange={(value) => onUpdate('website', value)}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Determine which header template to use
  if (template.id === "professional-navy") {
    return renderProfessionalNavyHeader();
  } else if (template.id === "modern-professional") {
    return renderModernProfessionalHeader();
  } else {
    return renderStandardHeader();
  }
}
