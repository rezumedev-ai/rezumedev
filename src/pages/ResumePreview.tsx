
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";

export default function ResumePreview() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const isMobile = useIsMobile();

  const { data: resume, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
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
    <div className="relative min-h-screen">
      <SimplifiedHeader />
      
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'top-20 right-4'} z-50`}>
        <Button 
          onClick={toggleEditMode} 
          variant="outline"
          size={isMobile ? "sm" : "default"}
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
      
      <div className="pt-16 pb-8 px-2 md:px-4 overflow-x-auto">
        <FinalResumePreview
          resumeData={resume as unknown as ResumeData}
          resumeId={id as string}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
