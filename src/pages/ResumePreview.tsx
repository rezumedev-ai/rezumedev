
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function ResumePreview() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
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
    if (!isEditing) {
      toast.info("Edit mode enabled. Click on any text to edit it directly.");
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
      <div className="fixed right-6 top-6 z-10 flex gap-2">
        <Button 
          variant={isEditing ? "outline" : "default"} 
          size="sm" 
          onClick={toggleEditMode}
          className="flex items-center gap-1"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </>
          )}
        </Button>
        
        {isEditing && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => {
              setIsEditing(false);
              toast.success("Resume saved successfully");
            }}
            className="flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
        )}
      </div>
      
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
        isEditing={isEditing}
      />
    </div>
  );
}
