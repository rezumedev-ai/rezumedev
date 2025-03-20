import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, LayoutTemplate, Save, Lock } from "lucide-react";
import { ResumeTemplate } from "../templates";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TemplateSelectionGrid } from "./TemplateSelectionGrid";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DownloadOptionsDialog } from "./DownloadOptionsDialog";

interface ResumePreviewToolbarProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  resumeId: string;
  onTemplateChange: (templateId: string) => void;
  onBackToDashboard: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

export function ResumePreviewToolbar({
  currentTemplateId,
  templates,
  resumeId,
  onTemplateChange,
  onBackToDashboard,
  isEditing = false,
  onToggleEdit,
}: ResumePreviewToolbarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    (profile.subscription_status === 'active' || profile.subscription_status === 'canceled');

  const handleTemplateChange = (templateId: string) => {
    onTemplateChange(templateId);
    setIsDialogOpen(false);
  };

  const navigateToPricing = () => {
    setShowSubscriptionDialog(false);
    navigate("/pricing");
  };

  return (
    <div className="w-full max-w-[21cm] mx-auto mb-4 sm:mb-6 bg-white rounded-lg shadow-md p-2 sm:p-3">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-primary hover:bg-gray-100 text-sm sm:text-base px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {onToggleEdit && (
            <Button 
              onClick={onToggleEdit} 
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          )}
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 sm:gap-2 bg-white shadow-sm hover:bg-gray-100 text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 h-auto"
                >
                  <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Template</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
                <TemplateSelectionGrid 
                  templates={templates}
                  currentTemplateId={currentTemplateId}
                  onTemplateChange={onTemplateChange}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white shadow-sm hover:bg-gray-100 text-sm px-3 py-2 h-auto"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  <span>Change Template</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white">
                <TemplateSelectionGrid 
                  templates={templates}
                  currentTemplateId={currentTemplateId}
                  onTemplateChange={handleTemplateChange}
                />
              </DialogContent>
            </Dialog>
          )}
          
          <DownloadOptionsDialog isDownloading={isDownloading} />
        </div>
      </div>

      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Subscription Required
            </DialogTitle>
            <DialogDescription>
              Downloading resumes requires an active subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 mb-4">
              Upgrade to a paid plan to unlock resume downloads, unlimited resume creation, premium templates, and AI-powered resume optimization.
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
    </div>
  );
}
