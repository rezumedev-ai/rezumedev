
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ResumeStatus } from "./ResumeStatus";
import { ResumeTitleEditor } from "./ResumeTitleEditor";
import { ResumeMetaInfo } from "./ResumeMetaInfo";
import { ResumeActionButtons } from "./ResumeActionButtons";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
  completion_status: string;
  current_step: number;
  professional_summary: {
    title: string;
  };
}

interface ResumeCardProps {
  resume: Resume;
  hasActiveSubscription: boolean;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onContinueQuiz: (id: string) => void;
  onShowDeleteFeatureDialog: () => void;
}

export function ResumeCard({
  resume,
  hasActiveSubscription,
  onEdit,
  onView,
  onDownload,
  onDelete,
  onContinueQuiz,
  onShowDeleteFeatureDialog
}: ResumeCardProps) {
  const displayTitle = resume.title || resume.professional_summary?.title || "Untitled";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className="group p-6 hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-primary/20"
      >
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
              <FileText className="w-6 h-6 text-primary group-hover:text-primary/80 transition-colors" />
            </div>
            <ResumeStatus 
              status={resume.completion_status} 
              currentStep={resume.current_step} 
            />
          </div>

          <div>
            <ResumeTitleEditor 
              resumeId={resume.id}
              initialTitle={displayTitle}
            />
            <ResumeMetaInfo 
              updatedAt={resume.updated_at}
              completionStatus={resume.completion_status}
              currentStep={resume.current_step}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResumeActionButtons 
              resumeId={resume.id}
              completionStatus={resume.completion_status}
              currentStep={resume.current_step}
              hasActiveSubscription={hasActiveSubscription}
              onEdit={onEdit}
              onView={onView}
              onDownload={onDownload}
              onDelete={onDelete}
              onContinueQuiz={onContinueQuiz}
              onShowDeleteFeatureDialog={onShowDeleteFeatureDialog}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
