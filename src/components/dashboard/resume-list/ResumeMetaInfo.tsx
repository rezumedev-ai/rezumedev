
import { Clock } from "lucide-react";

interface ResumeMetaInfoProps {
  updatedAt: string;
  completionStatus: string;
  currentStep: number;
}

export function ResumeMetaInfo({ updatedAt, completionStatus, currentStep }: ResumeMetaInfoProps) {
  const getTrimmedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center text-sm text-gray-500">
        <Clock className="w-3 h-3 mr-1 text-gray-400" />
        <span>{getTrimmedDate(updatedAt)}</span>
      </div>
      {completionStatus === 'draft' && currentStep > 1 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
          Resume Quiz in Progress
        </span>
      )}
    </div>
  );
}
