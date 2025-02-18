
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FinalResumePreview } from "@/components/resume-builder/FinalResumePreview";
import { ResumeData } from "@/types/resume";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleEdit = () => {
    navigate(`/resume-builder/${id}`);
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
      <FinalResumePreview
        resumeData={resume as unknown as ResumeData}
        resumeId={id as string}
      />
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={handleEdit}
          size="lg"
          className="shadow-lg"
        >
          Edit Resume
        </Button>
      </div>
    </div>
  );
}
