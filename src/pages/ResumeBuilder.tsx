import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QuizFlow } from "@/components/resume-builder/QuizFlow";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (!id) {
    return null;
  }

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const handleUpdate = async (section: string, value: any) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ [section]: value })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Changes saved",
        description: "Your resume has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the resume is completed, show editable preview
  if (resume?.completion_status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ResumePreview
            personalInfo={resume.personal_info}
            professionalSummary={resume.professional_summary}
            workExperience={resume.work_experience}
            education={resume.education}
            skills={resume.skills}
            certifications={resume.certifications}
            isEditable={true}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    );
  }

  // Otherwise show the quiz flow
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizFlow resumeId={id} onComplete={handleComplete} />
      </div>
    </div>
  );
}
