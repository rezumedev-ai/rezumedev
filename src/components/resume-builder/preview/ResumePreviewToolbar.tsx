
import { useState } from "react";
import { ResumeTemplate } from "../templates";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DownloadOptionsDialog } from "./DownloadOptionsDialog";
import { ProfileImageButton } from "./ProfileImageButton";
import { NavigationButton } from "./toolbar/NavigationButton";
import { EditButton } from "./toolbar/EditButton";
import { TemplateSelection } from "./toolbar/TemplateSelection";
import { SubscriptionDialog } from "./toolbar/SubscriptionDialog";

interface ResumePreviewToolbarProps {
  currentTemplateId: string;
  templates: ResumeTemplate[];
  resumeId: string;
  onTemplateChange: (templateId: string) => void;
  onBackToDashboard: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onProfileImageUpdate?: (imageUrl: string | null) => void;
  currentProfileImageUrl?: string;
}

export function ResumePreviewToolbar({
  currentTemplateId,
  templates,
  resumeId,
  onTemplateChange,
  onBackToDashboard,
  isEditing = false,
  onToggleEdit,
  onProfileImageUpdate,
  currentProfileImageUrl,
}: ResumePreviewToolbarProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const currentTemplate = templates.find(t => t.id === currentTemplateId);
  const supportsProfileImage = currentTemplate?.style.icons.circularImage;
  
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

  const handleTemplateSwitching = (templateId: string) => {
    if (templateId === currentTemplateId) return;
    onTemplateChange(templateId);
  };

  return (
    <div className="w-full max-w-[21cm] mx-auto mb-4 sm:mb-6 bg-white rounded-lg shadow-md p-2 sm:p-3">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
        <NavigationButton onBackToDashboard={onBackToDashboard} />
        
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {onToggleEdit && (
            <EditButton isEditing={isEditing} onToggleEdit={onToggleEdit} />
          )}
          
          {supportsProfileImage && onProfileImageUpdate && (
            <ProfileImageButton
              resumeId={resumeId}
              currentImageUrl={currentProfileImageUrl}
              onImageUpdate={onProfileImageUpdate}
            />
          )}
          
          <TemplateSelection
            currentTemplateId={currentTemplateId}
            templates={templates}
            onTemplateChange={handleTemplateSwitching}
          />
          
          <DownloadOptionsDialog isDownloading={isDownloading} />
        </div>
      </div>

      <SubscriptionDialog 
        isOpen={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        onNavigateToPricing={() => {
          setShowSubscriptionDialog(false);
          navigate("/pricing");
        }}
      />
    </div>
  );
}
