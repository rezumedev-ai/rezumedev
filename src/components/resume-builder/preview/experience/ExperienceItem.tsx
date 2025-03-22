
import { WorkExperience } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDateRange } from "@/utils/format-dates";

interface ExperienceItemProps {
  experience: WorkExperience;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceItem({ 
  experience, 
  index, 
  isEditing, 
  onEdit, 
  onDelete 
}: ExperienceItemProps) {
  return (
    <div 
      className={`pb-3 ${index < 1 ? 'border-b border-gray-200' : ''} cursor-pointer`}
      onClick={onEdit}
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
      
      <ul className="mt-2 text-sm text-gray-600 list-none pl-0 space-y-1">
        {experience.responsibilities.map((resp, respIndex) => (
          <li key={respIndex} className="flex items-start ml-1" data-pdf-bullet-item>
            <div className="flex items-start w-full" data-pdf-bullet-container>
              <span 
                className="inline-flex items-center justify-center w-2 h-2 min-w-2 min-h-2 rounded-full bg-black mr-2 shrink-0 mt-1.5" 
                data-pdf-bullet
                style={{ flexShrink: 0 }}
              ></span>
              <span 
                className="leading-snug" 
                data-pdf-bullet-text
                style={{ display: 'inline-block', width: 'calc(100% - 10px)' }}
              >{resp}</span>
            </div>
          </li>
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
