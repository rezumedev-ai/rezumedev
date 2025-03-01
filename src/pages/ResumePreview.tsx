
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { data: resume, isLoading, refetch } = useQuery({
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

  const handleRegenerate = async () => {
    try {
      if (!resume || !id) {
        toast.error("Resume data not found");
        return;
      }

      setIsRegenerating(true);
      
      console.log("Starting regeneration for resume:", id);
      
      // First update the status
      const { error: updateError } = await supabase
        .from("resumes")
        .update({ 
          completion_status: "enhancing"
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating status:", updateError);
        throw updateError;
      }

      console.log("Status updated, calling generate-professional-resume function");

      // Call the generate-professional-resume function with the existing resume data
      const { data: enhanceData, error } = await supabase.functions.invoke('generate-professional-resume', {
        body: { 
          resumeData: resume,
          resumeId: id
        }
      });

      if (error) {
        console.error("Error calling generate-professional-resume function:", error);
        throw error;
      }

      console.log("generate-professional-resume function called successfully:", enhanceData);

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 30; // 1 minute max waiting time
      
      const checkCompletion = setInterval(async () => {
        attempts++;
        console.log(`Checking completion attempt ${attempts}`);

        try {
          const { data: pollData, error: pollError } = await supabase
            .from("resumes")
            .select("completion_status")
            .eq("id", id)
            .single();

          if (pollError) {
            console.error("Error polling for completion:", pollError);
            clearInterval(checkCompletion);
            setIsRegenerating(false);
            throw pollError;
          }

          console.log("Poll response:", pollData);

          if (pollData.completion_status === "completed") {
            clearInterval(checkCompletion);
            setIsRegenerating(false);
            await refetch();
            toast.success("Resume has been regenerated successfully!");
          } else if (pollData.completion_status === "error") {
            clearInterval(checkCompletion);
            setIsRegenerating(false);
            toast.error("An error occurred while regenerating your resume. Please try again.");
          } else if (attempts >= maxAttempts) {
            clearInterval(checkCompletion);
            setIsRegenerating(false);
            toast.error("Regeneration is taking longer than expected. Please try again.");
          }
        } catch (pollError) {
          clearInterval(checkCompletion);
          setIsRegenerating(false);
          console.error("Error in polling:", pollError);
          toast.error("Error checking regeneration status");
        }
      }, 2000);

    } catch (error) {
      console.error("Error regenerating resume:", error);
      setIsRegenerating(false);
      toast.error("Failed to regenerate resume. Please try again.");
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
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="text-sm"
            >
              Back to Dashboard
            </Button>
          </div>
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Regenerating...' : 'Regenerate with AI'}
          </Button>
        </div>
      </div>
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
      />
    </div>
  );
}
