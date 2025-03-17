
import { useState, useEffect } from "react";
import { ResumeData } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export function useResumeBuilderState(resume: any | null) {
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
    setCurrentStep,
    formData,
    setFormData,
    handleInputChange
  };
}
