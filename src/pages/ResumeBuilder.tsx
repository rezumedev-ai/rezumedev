
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QuizFlow } from "@/components/resume-builder/QuizFlow";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { LoadingState } from "@/components/resume-builder/LoadingState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkExperience } from "@/types/resume";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      return data;
    },
    enabled: !!id,
    retry: 1
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
    return <LoadingState status="loading" />;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load resume. Redirecting to dashboard...",
      variant: "destructive",
    });
    navigate("/dashboard");
    return null;
  }

  if (!resume || !resume.completion_status) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
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
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 flex justify-center">
          <div className="w-full" style={{ maxWidth: '21cm' }}>
            <ResumePreview
              personalInfo={resume.personal_info as {
                fullName: string;
                email: string;
                phone: string;
                linkedin?: string;
                website?: string;
              }}
              professionalSummary={resume.professional_summary as {
                title: string;
                summary: string;
              }}
              workExperience={(resume.work_experience as unknown as WorkExperience[]) || []}
              education={(resume.education as {
                degreeName: string;
                schoolName: string;
                startDate: string;
                endDate: string;
                isCurrentlyEnrolled?: boolean;
              }[]) || []}
              skills={(resume.skills as {
                hard_skills: string[];
                soft_skills: string[];
              }) || { hard_skills: [], soft_skills: [] }}
              certifications={(resume.certifications as {
                name: string;
                organization: string;
                completionDate: string;
              }[]) || []}
              templateId={resume.template_id || "minimal-clean"}
              isEditable={true}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizFlow resumeId={id} onComplete={handleComplete} />
      </div>
    </div>
  );
}
