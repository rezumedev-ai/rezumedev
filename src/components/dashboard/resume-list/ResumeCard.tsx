
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock } from "lucide-react";
import { StatusBadge } from "./card/StatusBadge";
import { TitleEditor } from "./card/TitleEditor";
import { ActionButtons } from "./card/ActionButtons";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleSaveTitle = async (newTitle: string) => {
    const { error } = await supabase
      .from('resumes')
      .update({ title: newTitle })
      .eq('id', resume.id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not update resume title",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Resume title updated",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  };

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
            
            <StatusBadge
              status={resume.completion_status}
              currentStep={resume.current_step}
            />
          </div>

          <div>
            <TitleEditor 
              title={resume.title || resume.professional_summary?.title || "Untitled"}
              onSave={handleSaveTitle}
            />
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-3 h-3 mr-1 text-gray-400" />
                <span>{getTrimmedDate(resume.updated_at)}</span>
              </div>
              {resume.completion_status === 'draft' && resume.current_step > 1 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Resume Quiz in Progress
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ActionButtons 
              resumeId={resume.id}
              isCompleted={resume.completion_status === 'completed'}
              hasStepsInProgress={resume.completion_status === 'draft' && resume.current_step > 1}
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
