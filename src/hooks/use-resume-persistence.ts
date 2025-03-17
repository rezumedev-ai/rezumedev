
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

const TOTAL_STEPS = 7;

type ResumeUpsertData = {
  id?: string;
  user_id: string;
  title: string;
  personal_info: Json;
  professional_summary: Json;
  work_experience: Json[];
  education: Json[];
  skills: Json;
  certifications: Json[];
  current_step: number;
  completion_status: string;
  template_id?: string;
};

export function useResumePersistence(id?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProgress = async (userId: string, formData: ResumeData, currentStep: number) => {
    if (!userId) return null;
    
    const isNew = !id;

    const upsertData: ResumeUpsertData = {
      ...(id ? { id } : {}),
      user_id: userId,
      title: formData.professional_summary.title || "Untitled Resume",
      personal_info: formData.personal_info as Json,
      professional_summary: formData.professional_summary as Json,
      work_experience: formData.work_experience as unknown as Json[],
      education: formData.education as unknown as Json[],
      skills: formData.skills as unknown as Json,
      certifications: formData.certifications as unknown as Json[],
      current_step: currentStep,
      completion_status: currentStep === TOTAL_STEPS ? 'completed' : 'draft',
      template_id: formData.template_id
    };

    const { data, error } = await supabase
      .from("resumes")
      .upsert(upsertData)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
      return null;
    }

    if (isNew && data) {
      navigate(`/resume-builder/${data.id}`, { replace: true });
    }

    queryClient.invalidateQueries({ queryKey: ["resumes"] });
    return data;
  };

  return { saveProgress, TOTAL_STEPS };
}
