
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
      setIsRegenerating(true);
      
      // First update the status
      const { error: updateError } = await supabase
        .from("resumes")
        .update({ completion_status: "enhancing" })
        .eq("id", id);

      if (updateError) throw updateError;

      // Call the enhance-resume function
      const { error } = await supabase.functions.invoke('enhance-resume', {
        body: { resumeData: resume }
      });

      if (error) throw error;

      // Poll for completion
      const checkCompletion = setInterval(async () => {
        const { data, error: pollError } = await supabase
          .from("resumes")
          .select("completion_status")
          .eq("id", id)
          .single();

        if (pollError) {
          clearInterval(checkCompletion);
          throw pollError;
        }

        if (data.completion_status === "completed") {
          clearInterval(checkCompletion);
          setIsRegenerating(false);
          refetch();
          toast.success("Resume has been regenerated successfully!");
        }
      }, 2000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(checkCompletion);
        setIsRegenerating(false);
        toast.error("Regeneration is taking longer than expected. Please try again.");
      }, 120000);

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
