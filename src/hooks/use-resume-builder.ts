
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useResumeBuilderState } from "./use-resume-builder-state";
import { useResumeValidator } from "./use-resume-validator";
import { useResumePersistence } from "./use-resume-persistence";

export const useResumeBuilder = (id?: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { validateCurrentStep } = useResumeValidator();
  const { saveProgress, TOTAL_STEPS } = useResumePersistence(id);

  const { data: resume } = useQuery({
    queryKey: ["resume", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handleInputChange
  } = useResumeBuilderState(resume);

  const handleNext = async () => {
    if (!validateCurrentStep(currentStep, formData)) return;
    if (!user?.id) return;

    await saveProgress(user.id, formData, currentStep);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate("/dashboard");
    }
  };

  return {
    currentStep,
    formData,
    handleInputChange,
    handleNext,
    handlePrevious,
    setFormData,
    TOTAL_STEPS
  };
};
