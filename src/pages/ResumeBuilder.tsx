
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QuizFlow } from "@/components/resume-builder/QuizFlow";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { LoadingState } from "@/components/resume-builder/LoadingState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkExperience } from "@/types/resume";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { data: resume, isLoading, error } = useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching resume:', error);
        throw error;
      }
      console.log("Resume data fetched:", data);
      return data;
    },
    enabled: !!id,
    retry: 1
  });

  if (!id) {
    console.log("No resume ID provided, redirecting to new-resume");
    navigate('/new-resume');
    return null;
  }

  const handleComplete = () => {
    navigate(`/resume-preview/${id}`);
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
    console.log("Resume data is loading...");
    return <LoadingState status="loading" />;
  }

  if (error) {
    console.error("Error loading resume:", error);
    toast({
      title: "Error",
      description: "Failed to load resume. Redirecting to dashboard...",
      variant: "destructive",
    });
    navigate("/dashboard");
    return null;
  }

  if (!resume) {
    console.error("No resume data found");
    toast({
      title: "Error",
      description: "No resume data found. Creating a new resume...",
      variant: "destructive",
    });
    navigate("/new-resume");
    return null;
  }

  console.log("Resume completion status:", resume.completion_status);
  console.log("Showing resume builder with data:", resume);

  if (!resume.completion_status || resume.completion_status === 'draft') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <QuizFlow resumeId={id} onComplete={handleComplete} />
        </div>
      </div>
    );
  }

  if (resume.completion_status === 'enhancing') {
    return <LoadingState status="enhancing" />;
  }

  if (resume.completion_status === 'completed') {
    navigate(`/resume-preview/${id}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizFlow resumeId={id} onComplete={handleComplete} />
      </div>
    </div>
  );
}
