
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Download, Trash2, ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeActionButtonsProps {
  resumeId: string;
  completionStatus: string;
  currentStep: number;
  hasActiveSubscription: boolean;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onContinueQuiz: (id: string) => void;
  onShowDeleteFeatureDialog: () => void;
}

export function ResumeActionButtons({
  resumeId,
  completionStatus,
  currentStep,
  hasActiveSubscription,
  onEdit,
  onView,
  onDownload,
  onDelete,
  onContinueQuiz,
  onShowDeleteFeatureDialog
}: ResumeActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteClick = () => {
    if (!hasActiveSubscription) {
      onShowDeleteFeatureDialog();
      return;
    }
    
    if (showConfirmDelete) {
      setIsDeleting(true);
      onDelete(resumeId);
      setIsDeleting(false);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  if (completionStatus === 'draft' && currentStep > 1) {
    return (
      <motion.div
        className="col-span-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onContinueQuiz(resumeId)}
          className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
        >
          <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
          Continue Quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      {showConfirmDelete ? (
        <div className="col-span-2 flex gap-1">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteClick}
            className="w-full"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Confirm
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancelDelete}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(resumeId)}
              className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <Pencil className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Edit
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView(resumeId)}
              className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              View
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDownload(resumeId)}
              className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Download
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteClick}
              className={cn(
                "w-full group/btn transition-all duration-300",
                hasActiveSubscription 
                  ? "hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
                  : "bg-gray-100 text-gray-400 hover:bg-gray-100 cursor-not-allowed"
              )}
            >
              {hasActiveSubscription ? (
                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Delete
            </Button>
          </motion.div>
        </>
      )}
    </>
  );
}
