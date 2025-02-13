import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QuizFlow } from "@/components/resume-builder/QuizFlow";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkExperience } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";

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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Preparing Your Resume</h2>
          <p className="text-gray-600">Please wait while we enhance your resume with AI suggestions...</p>
        </div>
      </div>
    );
  }

  if (resume?.completion_status === 'enhancing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-3">Enhancing Your Resume</h2>
          <p className="text-gray-600 mb-4">
            Our AI is analyzing your experience and crafting professional descriptions...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (resume?.completion_status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
            isEditable={true}
            onUpdate={handleUpdate}
          />
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
