
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProgressOptions {
  id?: string;
  currentStep: number;
  formData: ResumeData;
  totalSteps: number;
}

export function useResumeProgress(options: ProgressOptions) {
  const { id, currentStep, formData, totalSteps } = options;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  type ResumeUpsertData = {
    id?: string;
    user_id: string;
    title: string;
    personal_info: any;
    professional_summary: any;
    work_experience: any[];
    education: any[];
    skills: any;
    certifications: any[];
    current_step: number;
    completion_status: string;
    template_id?: string;
  };

  const saveProgress = async () => {
    if (!user?.id) return null;
    if (isProcessing) return null;
    
    try {
      setIsProcessing(true);
      const isNew = !id;

      const upsertData: ResumeUpsertData = {
        ...(id ? { id } : {}),
        user_id: user.id,
        title: formData.professional_summary.title || "Untitled Resume",
        personal_info: formData.personal_info,
        professional_summary: formData.professional_summary,
        work_experience: formData.work_experience.map(exp => ({
          ...exp,
          responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
        })),
        education: formData.education,
        skills: formData.skills,
        certifications: formData.certifications,
        current_step: currentStep,
        completion_status: currentStep === totalSteps ? 'completed' : 'draft',
        template_id: formData.template_id
      };

      const { data, error } = await supabase
        .from("resumes")
        .upsert(upsertData)
        .select()
        .single();

      if (error) {
        console.error("Error saving progress:", error);
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
    } catch (error) {
      console.error("Error in saveProgress:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    saveProgress,
    isProcessing
  };
}
