
import { ResumePreview } from "./ResumePreview";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ResumeData } from "@/types/resume";
import { DownloadOptionsDialog } from "./preview/DownloadOptionsDialog";

interface FinalResumePreviewProps {
  resumeData: ResumeData;
  templateId?: string;
  onEdit?: () => void;
  resumeId: string;
}

export function FinalResumePreview({
  resumeData,
  templateId,
  onEdit,
  resumeId
}: FinalResumePreviewProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Resume Preview</h1>
          <div className="flex gap-4">
            {onEdit && (
              <Button variant="outline" onClick={onEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            )}
            <DownloadOptionsDialog resumeId={resumeId} />
          </div>
        </div>
        <div className="resume-content bg-white shadow-xl max-w-[794px] mx-auto">
          <ResumePreview
            personalInfo={resumeData.personal_info}
            professionalSummary={resumeData.professional_summary}
            workExperience={resumeData.work_experience}
            education={resumeData.education}
            skills={resumeData.skills}
            certifications={resumeData.certifications}
            templateId={templateId}
          />
        </div>
      </div>
    </div>
  );
}
