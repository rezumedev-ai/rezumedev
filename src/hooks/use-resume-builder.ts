
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useFormValidation } from "./builder/use-form-validation";
import { useResumeProgress } from "./builder/use-resume-progress";

const TOTAL_STEPS = 7;

const initialFormData: ResumeData = {
  personal_info: {
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    website: ""
  },
  professional_summary: {
    title: "",
    summary: ""
  },
  work_experience: [],
  education: [],
  skills: {
    hard_skills: [],
    soft_skills: []
  },
  certifications: []
};

export const useResumeBuilder = (id?: string) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResumeData>(initialFormData);
  const { validateCurrentStep } = useFormValidation();

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

  const { saveProgress, isProcessing } = useResumeProgress({
    id,
    currentStep,
    formData,
    totalSteps: TOTAL_STEPS,
  });

  useEffect(() => {
    if (resume) {
      // Process work experience
      const workExperience = Array.isArray(resume.work_experience) 
        ? resume.work_experience.map((exp: any) => ({
            jobTitle: exp.jobTitle || "",
            companyName: exp.companyName || "",
            location: exp.location,
            startDate: exp.startDate || "",
            endDate: exp.endDate || "",
            isCurrentJob: exp.isCurrentJob || false,
            responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
          }))
        : [];

      // Process education
      const education = Array.isArray(resume.education)
        ? resume.education.map((edu: any) => ({
            degreeName: edu.degreeName || "",
            schoolName: edu.schoolName || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            isCurrentlyEnrolled: edu.isCurrentlyEnrolled || false
          }))
        : [];

      // Process certifications
      const certifications = Array.isArray(resume.certifications)
        ? resume.certifications.map((cert: any) => ({
            name: cert.name || "",
            organization: cert.organization || "",
            completionDate: cert.completionDate || ""
          }))
        : [];

      // Process skills
      const defaultSkills = { hard_skills: [], soft_skills: [] };
      const skills = resume.skills && typeof resume.skills === 'object'
        ? {
            hard_skills: Array.isArray((resume.skills as any).hard_skills) 
              ? (resume.skills as any).hard_skills 
              : [],
            soft_skills: Array.isArray((resume.skills as any).soft_skills) 
              ? (resume.skills as any).soft_skills 
              : []
          }
        : defaultSkills;

      // Update form data
      setFormData({
        personal_info: resume.personal_info as ResumeData['personal_info'],
        professional_summary: resume.professional_summary as ResumeData['professional_summary'],
        work_experience: workExperience,
        education: education,
        skills,
        certifications: certifications,
        template_id: resume.template_id
      });
      
      // Update current step
      setCurrentStep(resume.current_step || 1);
    }
  }, [resume]);

  const handleNext = async () => {
    if (!validateCurrentStep(currentStep, formData)) return;

    await saveProgress();
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

  const handleInputChange = (section: keyof ResumeData, field: string, value: any) => {
    setFormData(prevData => {
      if (!prevData[section] || typeof prevData[section] !== 'object') {
        return prevData;
      }

      return {
        ...prevData,
        [section]: {
          ...(prevData[section] as object),
          [field]: value
        }
      };
    });
  };

  return {
    currentStep,
    formData,
    handleInputChange,
    handleNext,
    handlePrevious,
    setFormData,
    TOTAL_STEPS,
    isProcessing
  };
};
