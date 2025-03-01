
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit2, FileDown, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resumeTemplates } from "@/components/resume-builder/templates";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: resume, isLoading, refetch } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Set the selected template based on fetched data
      if (data && data.template_id) {
        setSelectedTemplate(data.template_id);
      }
      
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

  const handleTemplateChange = async (templateId: string) => {
    if (!id || templateId === selectedTemplate) return;
    
    setSelectedTemplate(templateId);
    
    try {
      const { error } = await supabase
        .from("resumes")
        .update({ template_id: templateId })
        .eq("id", id);
        
      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template. Please try again.");
    }
  };

  const handleEditClick = () => {
    if (id) {
      navigate(`/resume-builder/${id}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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
    <div className="relative min-h-screen bg-gray-50">
      {/* Simple top navigation bar */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-600"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {/* Template selector */}
            <Tabs value={selectedTemplate || ''} onValueChange={handleTemplateChange}>
              <TabsList>
                {resumeTemplates.map((template) => (
                  <TabsTrigger key={template.id} value={template.id}>
                    {template.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // This is a placeholder for the download functionality
                // We'll delegate the actual download to FinalResumePreview
                document.getElementById('download-resume-button')?.click();
              }}
            >
              <FileDown className="w-4 h-4 mr-1" />
              Download
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate with AI'}
            </Button>
          </div>
        </div>
      </div>

      <div className="py-6">
        <FinalResumePreview
          resumeData={resume as unknown as ResumeData}
          resumeId={id as string}
          onRegenerateClick={handleRegenerate}
          isRegenerating={isRegenerating}
        />
      </div>
    </div>
  );
}
