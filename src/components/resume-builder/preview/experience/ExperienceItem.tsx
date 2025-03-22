
import { formatDate } from "@/lib/utils";
import { WorkExperience } from "@/types/resume";
import { ResumeTemplate } from "../../templates";
import { EditableContent } from "../../ui/EditableContent";
import { ArrowRight, Circle } from "lucide-react";

interface ExperienceItemProps {
  experience: WorkExperience;
  template: ResumeTemplate;
  isEditing: boolean;
  onUpdate?: (field: keyof WorkExperience, value: string | string[]) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExperienceItem({ 
  experience, 
  template, 
  isEditing,
  onUpdate,
  onEdit,
  onDelete
}: ExperienceItemProps) {
  // Get the appropriate bullet type based on template
  const getBulletPoint = () => {
    switch(template.style.icons.bullets) {
      case 'arrow':
        return <ArrowRight className="w-3 h-3 text-emerald-700 inline-block" />;
      case 'dash':
        return <span className="inline-block w-2 h-0.5 bg-gray-400"></span>;
      case 'dot':
      default:
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-800"></span>;
    }
  };
  
  // Special rendering for Professional Navy template
  if (template.id === "professional-navy") {
    return (
      <div className="mb-5 professional-navy-work-item">
        <div className="flex justify-between items-baseline">
          <h4 className="font-bold text-[#0F2B5B]">
            {isEditing && onUpdate ? (
              <EditableContent
                value={experience.jobTitle}
                placeholder="Job Title"
                isEditing={isEditing}
                onChange={(value) => onUpdate('jobTitle', value)}
              />
            ) : (
              experience.jobTitle
            )}
          </h4>
          <div className="text-sm text-gray-500">
            {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
          </div>
        </div>
        
        <div className="text-gray-700 mb-2">
          {isEditing && onUpdate ? (
            <EditableContent
              value={experience.companyName}
              placeholder="Company Name"
              isEditing={isEditing}
              onChange={(value) => onUpdate('companyName', value)}
            />
          ) : (
            experience.companyName
          )}
          {experience.location && (
            <>
              <span className="mx-1">•</span>
              {isEditing && onUpdate ? (
                <EditableContent
                  value={experience.location}
                  placeholder="Location"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('location', value)}
                  className="inline"
                />
              ) : (
                experience.location
              )}
            </>
          )}
        </div>
        
        <ul className="space-y-1.5">
          {experience.responsibilities.map((responsibility, index) => (
            <li key={index} className="flex items-start">
              <span className="professional-navy-bullet mt-1.5 mr-2"></span>
              {isEditing && onUpdate ? (
                <EditableContent
                  value={responsibility}
                  placeholder={`Responsibility ${index + 1}`}
                  isEditing={isEditing}
                  onChange={(value) => {
                    const newResponsibilities = [...experience.responsibilities];
                    newResponsibilities[index] = value;
                    onUpdate('responsibilities', newResponsibilities);
                  }}
                  className="flex-1"
                />
              ) : (
                <span>{responsibility}</span>
              )}
            </li>
          ))}
        </ul>
        
        {isEditing && onEdit && onDelete && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onEdit}
              className="text-xs text-primary hover:text-primary/80"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs text-destructive hover:text-destructive/80"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Modern Professional template
  if (template.id === "modern-professional") {
    return (
      <div className="mb-5">
        <div className="flex justify-between items-baseline">
          <h4 className="font-semibold text-gray-800">
            {isEditing && onUpdate ? (
              <EditableContent
                value={experience.jobTitle}
                placeholder="Job Title"
                isEditing={isEditing}
                onChange={(value) => onUpdate('jobTitle', value)}
              />
            ) : (
              experience.jobTitle
            )}
          </h4>
          <div className="text-sm text-gray-500">
            {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
          </div>
        </div>
        
        <div className="text-gray-600 mb-2">
          {isEditing && onUpdate ? (
            <EditableContent
              value={experience.companyName}
              placeholder="Company Name"
              isEditing={isEditing}
              onChange={(value) => onUpdate('companyName', value)}
            />
          ) : (
            experience.companyName
          )}
          {experience.location && (
            <>
              <span className="mx-1">•</span>
              {isEditing && onUpdate ? (
                <EditableContent
                  value={experience.location}
                  placeholder="Location"
                  isEditing={isEditing}
                  onChange={(value) => onUpdate('location', value)}
                  className="inline"
                />
              ) : (
                experience.location
              )}
            </>
          )}
        </div>
        
        <ul className="space-y-1.5">
          {experience.responsibilities.map((responsibility, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center mr-2 mt-1.5">
                {getBulletPoint()}
              </span>
              {isEditing && onUpdate ? (
                <EditableContent
                  value={responsibility}
                  placeholder={`Responsibility ${index + 1}`}
                  isEditing={isEditing}
                  onChange={(value) => {
                    const newResponsibilities = [...experience.responsibilities];
                    newResponsibilities[index] = value;
                    onUpdate('responsibilities', newResponsibilities);
                  }}
                  className="flex-1"
                />
              ) : (
                <span>{responsibility}</span>
              )}
            </li>
          ))}
        </ul>
        
        {isEditing && onEdit && onDelete && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onEdit}
              className="text-xs text-primary hover:text-primary/80"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs text-destructive hover:text-destructive/80"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Default template style
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline">
        <h4 className="font-semibold">
          {isEditing && onUpdate ? (
            <EditableContent
              value={experience.jobTitle}
              placeholder="Job Title"
              isEditing={isEditing}
              onChange={(value) => onUpdate('jobTitle', value)}
            />
          ) : (
            experience.jobTitle
          )}
        </h4>
        <div className="text-sm text-gray-500">
          {formatDate(experience.startDate)} - {experience.isCurrentJob ? 'Present' : formatDate(experience.endDate)}
        </div>
      </div>
      
      <div className="text-gray-600 mb-2">
        {isEditing && onUpdate ? (
          <EditableContent
            value={experience.companyName}
            placeholder="Company Name"
            isEditing={isEditing}
            onChange={(value) => onUpdate('companyName', value)}
          />
        ) : (
          experience.companyName
        )}
        {experience.location && (
          <>
            <span className="mx-1">•</span>
            {isEditing && onUpdate ? (
              <EditableContent
                value={experience.location}
                placeholder="Location"
                isEditing={isEditing}
                onChange={(value) => onUpdate('location', value)}
                className="inline"
              />
            ) : (
              experience.location
            )}
          </>
        )}
      </div>
      
      <ul className="list-disc ml-5 space-y-1">
        {experience.responsibilities.map((responsibility, index) => (
          <li key={index} className="flex items-start">
            {isEditing && onUpdate ? (
              <EditableContent
                value={responsibility}
                placeholder={`Responsibility ${index + 1}`}
                isEditing={isEditing}
                onChange={(value) => {
                  const newResponsibilities = [...experience.responsibilities];
                  newResponsibilities[index] = value;
                  onUpdate('responsibilities', newResponsibilities);
                }}
              />
            ) : (
              <span>{responsibility}</span>
            )}
          </li>
        ))}
      </ul>
      
      {isEditing && onEdit && onDelete && (
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onEdit}
            className="text-xs text-primary hover:text-primary/80"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-xs text-destructive hover:text-destructive/80"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
