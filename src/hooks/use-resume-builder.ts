
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData, WorkExperience, Education, Certification } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";

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

export const useResumeBuilder = (id?: string) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResumeData>({
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
  });

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

  useEffect(() => {
    if (resume) {
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

      const education = Array.isArray(resume.education)
        ? resume.education.map((edu: any) => ({
            degreeName: edu.degreeName || "",
            schoolName: edu.schoolName || "",
            startDate: edu.startDate || "",
            endDate: edu.endDate || "",
            isCurrentlyEnrolled: edu.isCurrentlyEnrolled || false
          }))
        : [];

      const certifications = Array.isArray(resume.certifications)
        ? resume.certifications.map((cert: any) => ({
            name: cert.name || "",
            organization: cert.organization || "",
            completionDate: cert.completionDate || ""
          }))
        : [];

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

      setFormData({
        personal_info: resume.personal_info as ResumeData['personal_info'],
        professional_summary: resume.professional_summary as ResumeData['professional_summary'],
        work_experience: workExperience,
        education: education,
        skills,
        certifications: certifications,
        template_id: resume.template_id
      });
      
      setCurrentStep(resume.current_step || 1);
    }
  }, [resume]);

  const saveProgress = async () => {
    if (!user?.id) return null;
    
    const isNew = !id;

    const upsertData: ResumeUpsertData = {
      ...(id ? { id } : {}),
      user_id: user.id,
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

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      const requiredFields = ['fullName', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !formData.personal_info[field as keyof typeof formData.personal_info]);
      if (missingFields.length > 0) {
        toast({
          title: "Required Fields Missing",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 2) {
      const requiredFields = ['title', 'summary'];
      const missingFields = requiredFields.filter(field => !formData.professional_summary[field as keyof typeof formData.professional_summary]);
      if (missingFields.length > 0) {
        toast({
          title: "Required Fields Missing",
          description: `Please fill in: ${missingFields.join(", ")}`,
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 3 && formData.work_experience.length > 0) {
      const hasInvalidExperience = formData.work_experience.some(exp => {
        const isEndDateRequired = !exp.isCurrentJob;
        return !exp.jobTitle || !exp.companyName || !exp.startDate || 
               (isEndDateRequired && !exp.endDate) || exp.responsibilities.some(r => !r.trim());
      });

      if (hasInvalidExperience) {
        toast({
          title: "Incomplete Work Experience",
          description: "Please fill in all required fields for each work experience entry",
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 4 && formData.education.length > 0) {
      const hasInvalidEducation = formData.education.some(edu => {
        const isEndDateRequired = !edu.isCurrentlyEnrolled;
        return !edu.degreeName || !edu.schoolName || !edu.startDate || 
               (isEndDateRequired && !edu.endDate);
      });

      if (hasInvalidEducation) {
        toast({
          title: "Incomplete Education",
          description: "Please fill in all required fields for each education entry",
          variant: "destructive"
        });
        return false;
      }
    } else if (currentStep === 6 && formData.certifications.length > 0) {
      const hasInvalidCertification = formData.certifications.some(cert => {
        return !cert.name || !cert.organization || !cert.completionDate;
      });

      if (hasInvalidCertification) {
        toast({
          title: "Incomplete Certification",
          description: "Please fill in all required fields for each certification",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) return;

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
    TOTAL_STEPS
  };
};
