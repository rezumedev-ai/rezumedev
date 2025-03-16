import { Plus, Pencil, Trash2, FileText, Eye, Download, Check, X, ArrowRight, Archive, Clock, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_plan, subscription_status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user
  });

  const hasActiveSubscription = profile && 
    profile.subscription_plan && 
    profile.subscription_status === 'active';

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const sortedResumes = [...resumes].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  const handleDelete = async (id: string) => {
    if (showConfirmDelete !== id) {
      setShowConfirmDelete(id);
      return;
    }
    
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
    setShowConfirmDelete(null);
  };

  const handleCancelDelete = (id: string) => {
    setShowConfirmDelete(null);
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

  const startEditingTitle = (resume: Resume) => {
    setEditingId(resume.id);
    setEditTitle(resume.title || resume.professional_summary?.title || "Untitled");
  };

  const saveTitle = async (id: string) => {
    const { error } = await supabase
      .from('resumes')
      .update({ title: editTitle })
      .eq('id', id);

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
    setEditingId(null);
  };

  const handleContinueQuiz = (id: string) => {
    navigate(`/resume-builder/${id}`);
  };

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

  const handleCreateNewResume = () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionDialog(true);
    } else {
      onCreateNew();
    }
  };

  const navigateToPricing = () => {
    setShowSubscriptionDialog(false);
    navigate("/pricing");
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={item}
      >
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Resumes</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600">Craft your professional story with our intelligent resume builder</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            onClick={handleCreateNewResume} 
            className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/25 w-full sm:w-auto group"
          >
            <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Create New Resume
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
      >
        {sortedResumes.map((resume, index) => (
          <motion.div 
            key={resume.id}
            variants={item}
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
                  {editingId === resume.id ? (
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
                        onClick={() => saveTitle(resume.id)}
                        className="p-2 hover:bg-green-50 rounded-full text-green-600"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        onClick={() => setEditingId(null)}
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
                        onClick={() => startEditingTitle(resume)}
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
                        onClick={() => handleContinueQuiz(resume.id)}
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
                          onClick={() => handleEdit(resume.id)}
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
                          onClick={() => handleView(resume.id)}
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
                          onClick={() => handleDownload(resume.id)}
                          className="w-full group/btn hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                        >
                          <Download className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                          Download
                        </Button>
                      </motion.div>
                      
                      {showConfirmDelete === resume.id ? (
                        <div className="col-span-2 flex gap-1">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(resume.id)}
                            className="w-full"
                            disabled={isDeleting === resume.id}
                          >
                            {isDeleting === resume.id ? (
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
                            onClick={() => handleCancelDelete(resume.id)}
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
                            onClick={() => handleDelete(resume.id)}
                            className="w-full group/btn hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
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
        ))}

        <motion.div
          variants={item}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Card 
            className="h-full group p-6 border-dashed hover:border-primary/50 transition-all duration-500 cursor-pointer bg-white/50 backdrop-blur-sm"
            onClick={handleCreateNewResume}
          >
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 p-6">
              <motion.div 
                className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "rgba(99, 102, 241, 0.1)" 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {hasActiveSubscription ? (
                  <Plus className="w-8 h-8 text-primary/60" />
                ) : (
                  <Lock className="w-8 h-8 text-primary/60" />
                )}
              </motion.div>
              <div className="text-center space-y-1">
                <p className="font-medium text-lg">Create New Resume</p>
                {!hasActiveSubscription && (
                  <p className="text-xs text-amber-600">Subscription required</p>
                )}
                <p className="text-sm text-gray-500">Start building your professional story</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Subscription Required
            </DialogTitle>
            <DialogDescription>
              Creating resumes requires an active subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 mb-4">
              Upgrade to a paid plan to unlock unlimited resume creation, premium templates, and AI-powered resume optimization.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
              className="sm:w-auto w-full"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={navigateToPricing}
              className="sm:w-auto w-full bg-gradient-to-r from-primary to-primary-hover"
            >
              View Pricing Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
