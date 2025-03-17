
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import refactored components
import { ResumeListHeader } from "./resume-list/ResumeListHeader";
import { ResumeCard } from "./resume-list/ResumeCard";
import { EmptyResumeCard } from "./resume-list/EmptyResumeCard";
import { SubscriptionDialog } from "./resume-list/SubscriptionDialog";
import { DeleteFeatureDialog } from "./resume-list/DeleteFeatureDialog";
import { useProfileQuery } from "./resume-list/useProfileQuery";
import { container, item } from "./resume-list/AnimationVariants";

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

interface ResumeListProps {
  resumes: Resume[];
  onCreateNew: () => void;
}

export function ResumeList({ resumes, onCreateNew }: ResumeListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showDeleteFeatureDialog, setShowDeleteFeatureDialog] = useState(false);
  const { user } = useAuth();

  const { data: profile } = useProfileQuery(user);

  const hasActiveSubscription = profile && 
    profile.subscription_plan && 
    (profile.subscription_status === 'active' || profile.subscription_status === 'canceled');

  const sortedResumes = [...resumes].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Could not delete resume",
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "Resume deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
    setIsDeleting(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/resume-builder/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/resume-preview/${id}`);
  };

  const handleDownload = (id: string) => {
    navigate(`/resume-preview/${id}`);
  };

  const handleContinueQuiz = (id: string) => {
    navigate(`/resume-builder/${id}`);
  };

  const handleCreateNewResume = () => {
    if (resumes.length === 0 || hasActiveSubscription) {
      onCreateNew();
    } else {
      setShowSubscriptionDialog(true);
    }
  };

  const navigateToPricing = () => {
    setShowSubscriptionDialog(false);
    setShowDeleteFeatureDialog(false);
    navigate("/pricing");
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <ResumeListHeader onCreateNew={handleCreateNewResume} />

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
      >
        {sortedResumes.map((resume) => (
          <motion.div key={resume.id} variants={item}>
            <ResumeCard
              resume={resume}
              hasActiveSubscription={!!hasActiveSubscription}
              onEdit={handleEdit}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onContinueQuiz={handleContinueQuiz}
              onShowDeleteFeatureDialog={() => setShowDeleteFeatureDialog(true)}
            />
          </motion.div>
        ))}

        <motion.div variants={item}>
          <EmptyResumeCard 
            onClick={handleCreateNewResume} 
            canCreateMoreResumes={resumes.length === 0 || !!hasActiveSubscription}
          />
        </motion.div>
      </motion.div>

      <SubscriptionDialog 
        isOpen={showSubscriptionDialog} 
        onClose={() => setShowSubscriptionDialog(false)}
        onViewPricing={navigateToPricing}
      />

      <DeleteFeatureDialog 
        isOpen={showDeleteFeatureDialog} 
        onClose={() => setShowDeleteFeatureDialog(false)}
        onViewPricing={navigateToPricing}
      />
    </motion.div>
  );
}
