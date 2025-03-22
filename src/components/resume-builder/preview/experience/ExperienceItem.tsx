
import { WorkExperience } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDateRange } from "@/utils/format-dates";

interface ExperienceItemProps {
  experience: WorkExperience;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExperienceItem({ 
  experience, 
  isEditing, 
  onEdit, 
  onDelete 
}: ExperienceItemProps) {
  return (
    <div 
      className="pb-3 mb-3 border-b border-gray-200 cursor-pointer"
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
      
      <ul className="mt-2 text-sm text-gray-600 space-y-1 responsibility-list">
        {experience.responsibilities.map((resp, respIndex) => (
          <li key={respIndex} className="flex items-start">
            <span className="bullet-point inline-flex items-center justify-center w-2 h-2 min-w-2 min-h-2 rounded-full bg-black mr-2 mt-1.5 shrink-0"></span>
            <span className="responsibility-text">{resp}</span>
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
