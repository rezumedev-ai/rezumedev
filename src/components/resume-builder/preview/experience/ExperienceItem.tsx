
import { WorkExperience } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDateRange } from "@/utils/format-dates";
import { BulletPoint } from "../../ui/BulletPoint";

interface ExperienceItemProps {
  experience: WorkExperience;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  template?: string;
}

export function ExperienceItem({ 
  experience, 
  index, 
  isEditing, 
  onEdit, 
  onDelete,
  template = "default"
}: ExperienceItemProps) {
  return (
    <div 
      className={`pb-3 ${index < 1 ? 'border-b border-gray-200' : ''} cursor-pointer pdf-experience-item`}
      onClick={onEdit}
      data-pdf-section="experience-item"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <div className="font-semibold text-gray-900">{experience.jobTitle}</div>
          <div className="text-sm text-gray-600">
            {experience.companyName}
            {experience.location && <span> • {experience.location}</span>}
          </div>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {formatDateRange(experience.startDate, experience.endDate)}
        </div>
      </div>
      
      <ul className="mt-2 text-sm text-gray-600 space-y-1 pl-0 pdf-bullet-list" data-pdf-bullet-list="true">
        {experience.responsibilities.map((resp, respIndex) => (
          <BulletPoint 
            key={respIndex}
            template={template}
            className="ml-0 leading-snug"
          >
            {resp}
          </BulletPoint>
        ))}
      </ul>
      
      {isEditing && (
        <div className="mt-2 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      )}
    </div>
  );
}
