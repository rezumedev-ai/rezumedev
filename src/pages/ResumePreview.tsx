
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-medium text-gray-700">Loading your resume...</div>
          <p className="text-gray-500 mt-2">This may take a moment</p>
        </motion.div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          className="text-center p-8 rounded-lg max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-red-500 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the resume you're looking for. It may have been deleted or never existed.</p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary/90"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div 
        className="sticky top-0 z-50 bg-white border-b shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-sm flex items-center gap-1 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Enhancing...' : 'Enhance with AI'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
      />
    </div>
  );
}
