
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export default function ResumePreview() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Function to maximize zoom out
  const handleZoomOut = () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      // Set to extreme zoom out (0.1 scale)
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=0.1, maximum-scale=2.0, user-scalable=yes');
      setIsZoomedOut(true);
    }
  };

  // Function to reset zoom
  const handleResetZoom = () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=2.0, user-scalable=yes');
      setIsZoomedOut(false);
    }
  };

  // Set initial zoom level depending on device
  useEffect(() => {
    // Add meta tag to prevent user scaling if on mobile
    if (isMobile) {
      // Find existing viewport meta tag
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        // Modify existing viewport meta to set initial-scale to 0.5 for better initial view
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=2.0, user-scalable=yes');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-500">Loading preview...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Resume not found</div>
      </div>
    );
  }

  return (
    <div className="relative bg-white min-h-screen">
      {isMobile && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {!isZoomedOut ? (
            <Button 
              size="sm" 
              onClick={handleZoomOut} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Zoom Out
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={handleResetZoom}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Reset Zoom
            </Button>
          )}
        </div>
      )}
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
      />
    </div>
  );
}
