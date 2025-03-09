
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResumePreview() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  // Set initial zoom level depending on device
  useEffect(() => {
    // Add meta tag to prevent user scaling if on mobile
    if (isMobile) {
      // Find existing viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        // Modify existing viewport meta to set initial-scale to 0.5 for mobile
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=0.5, user-scalable=yes');
      }
    }

    // Cleanup function to restore original viewport meta
    return () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, [isMobile]);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Ensure certifications is always an array, even if null/undefined
      if (!data.certifications) {
        data.certifications = [];
      }
      
      return data;
    }
  });

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.success("Resume saved successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={toggleEditMode} 
          variant="outline"
          className="bg-white shadow-md hover:bg-gray-100"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
        isEditing={isEditing}
      />
    </div>
  );
}
