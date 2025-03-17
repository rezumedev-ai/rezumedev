
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Pencil, 
  Eye, 
  Download, 
  Trash2, 
  Check, 
  X, 
  ArrowRight,
  Clock,
  Loader2,
  Lock
} from "lucide-react";

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
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  const startEditingTitle = () => {
    setEditingTitle(true);
    setEditTitle(resume.title || resume.professional_summary?.title || "Untitled");
  };

  const saveTitle = async () => {
    const { error } = await supabase
      .from('resumes')
      .update({ title: editTitle })
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
    setEditingTitle(false);
  };

  const handleDeleteClick = () => {
    if (!hasActiveSubscription) {
      onShowDeleteFeatureDialog();
      return;
    }
    
    if (showConfirmDelete) {
      setIsDeleting(true);
      onDelete(resume.id);
      setIsDeleting(false);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
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
            <div className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors duration-300 flex items-center gap-1",
              resume.completion_status === 'completed' 
                ? "bg-green-100 text-green-800 group-hover:bg-green-200"
                : "bg-amber-100 text-amber-800 group-hover:bg-amber-200"
            )}>
              {resume.completion_status === 'completed' ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Step {resume.current_step} of 7</span>
                </>
              )}
            </div>
          </div>

          <div>
            {editingTitle ? (
              <motion.div 
                className="flex gap-2 items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 border-primary/20 focus:border-primary/40"
                  placeholder="Enter resume title"
                  autoFocus
                />
                <motion.button 
                  onClick={saveTitle}
                  className="p-2 hover:bg-green-50 rounded-full text-green-600"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button 
                  onClick={() => setEditingTitle(false)}
                  className="p-2 hover:bg-red-50 rounded-full text-red-600"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 break-words group-hover:text-primary/90 transition-colors">
                  {resume.title || resume.professional_summary?.title || "Untitled"}
                </h3>
                <motion.button 
                  onClick={startEditingTitle}
                  className="p-1 h-auto hover:bg-primary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Pencil className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                </motion.button>
              </div>
            )}
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
            {resume.completion_status === 'draft' && resume.current_step > 1 ? (
              <motion.div
                className="col-span-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onContinueQuiz(resume.id)}
                  className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <ArrowRight className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                  Continue Quiz
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(resume.id)}
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
                    onClick={() => onView(resume.id)}
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
                    onClick={() => onDownload(resume.id)}
                    className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Download
                  </Button>
                </motion.div>
                
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
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
