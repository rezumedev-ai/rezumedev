
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import { PersonalInfoStep } from "@/components/resume-builder/PersonalInfoStep";
import { ProfessionalSummaryStep } from "@/components/resume-builder/ProfessionalSummaryStep";
import { WorkExperienceStep } from "@/components/resume-builder/WorkExperienceStep";
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { StepProgress } from "@/components/resume-builder/StepProgress";

const TOTAL_STEPS = 7;

export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrentJob?: boolean;
  responsibilities: string[];
}

interface Education {
  degreeName: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  isCurrentlyEnrolled?: boolean;
}

interface Certification {
  name: string;
  organization: string;
  completionDate: string;
}

interface ResumeData {
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  professional_summary: {
    title: string;
    summary: string;
  };
  work_experience: WorkExperience[];
  education: Education[];
  skills: {
    hard_skills: string[];
    soft_skills: string[];
  };
  certifications: Certification[];
}

export default function ResumeBuilder() {
  const { id } = useParams();
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
      setFormData({
        personal_info: resume.personal_info as ResumeData['personal_info'],
        professional_summary: resume.professional_summary as ResumeData['professional_summary'],
        work_experience: (resume.work_experience as Json[] || []).map((exp) => ({
          jobTitle: (exp as any).jobTitle || "",
          companyName: (exp as any).companyName || "",
          location: (exp as any).location,
          startDate: (exp as any).startDate || "",
          endDate: (exp as any).endDate || "",
          isCurrentJob: (exp as any).isCurrentJob || false,
          responsibilities: ((exp as any).responsibilities || []) as string[]
        })),
        education: (resume.education as Json[] || []).map((edu) => ({
          degreeName: (edu as any).degreeName || "",
          schoolName: (edu as any).schoolName || "",
          startDate: (edu as any).startDate || "",
          endDate: (edu as any).endDate || "",
          isCurrentlyEnrolled: (edu as any).isCurrentlyEnrolled || false
        })),
        skills: (resume.skills || { hard_skills: [], soft_skills: [] }) as ResumeData['skills'],
        certifications: (resume.certifications as Json[] || []).map((cert) => ({
          name: (cert as any).name || "",
          organization: (cert as any).organization || "",
          completionDate: (cert as any).completionDate || ""
        }))
      });
      setCurrentStep(resume.current_step || 1);
    }
  }, [resume]);

  const saveProgress = async () => {
    const isNew = !id;

    const upsertData = {
      ...(id ? { id } : {}),
      user_id: user?.id,
      title: formData.professional_summary.title || "Untitled Resume",
      personal_info: formData.personal_info as Json,
      professional_summary: formData.professional_summary as Json,
      work_experience: formData.work_experience as unknown as Json[],
      education: formData.education as unknown as Json[],
      skills: formData.skills as Json,
      certifications: formData.certifications as unknown as Json[],
      current_step: currentStep,
      completion_status: currentStep === TOTAL_STEPS ? 'completed' : 'draft'
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

  const handleInputChange = (section: keyof ResumeData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            formData={formData.personal_info}
            onChange={(field, value) => handleInputChange('personal_info', field, value)}
          />
        );
      case 2:
        return (
          <ProfessionalSummaryStep
            formData={formData.professional_summary}
            onChange={(field, value) => handleInputChange('professional_summary', field, value)}
          />
        );
      case 3:
        return (
          <WorkExperienceStep
            formData={formData.work_experience}
            onChange={(experiences) => setFormData(prev => ({ ...prev, work_experience: experiences }))}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information";
      case 2:
        return "Professional Summary";
      case 3:
        return "Work Experience";
      case 4:
        return "Education";
      case 5:
        return "Skills";
      case 6:
        return "Certifications";
      case 7:
        return "Review & Finish";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Let's start with your basic information";
      case 2:
        return "Tell us about your career objectives";
      case 3:
        return "Add your relevant work history";
      case 4:
        return "Add your educational background";
      case 5:
        return "List your key skills";
      case 6:
        return "Add any relevant certifications";
      case 7:
        return "Review your resume and make final adjustments";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-gray-900">
                {getStepTitle()}
              </h2>
              <p className="text-sm text-gray-500">
                {getStepDescription()}
              </p>
            </div>

            {renderStep()}
          </Card>

          <div className="space-y-4">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
                <ResumePreview
                  personalInfo={formData.personal_info}
                  professionalSummary={formData.professional_summary}
                  workExperience={formData.work_experience}
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
            {currentStep === TOTAL_STEPS ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
