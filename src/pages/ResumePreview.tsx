import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit2, FileDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resumeTemplates } from "@/components/resume-builder/templates";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      toast.success("Template updated successfully");
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template. Please try again.");
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    toast.success(isEditing ? "Edit mode disabled" : "Edit mode enabled - click on any text to edit");
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
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={handleEditClick}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              {isEditing ? "Editing..." : "Edit"}
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
          </div>
        </div>
      </div>

      <div className="py-6">
        <FinalResumePreview
          resumeData={resume as unknown as ResumeData}
          resumeId={id as string}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
