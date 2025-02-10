
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
import { ResumePreview } from "@/components/resume-builder/ResumePreview";
import { StepProgress } from "@/components/resume-builder/StepProgress";

const TOTAL_STEPS = 7;

interface WorkExperience {
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
        personal_info: (resume.personal_info || {}) as ResumeData['personal_info'],
        professional_summary: (resume.professional_summary || {}) as ResumeData['professional_summary'],
        work_experience: (resume.work_experience || []) as unknown as WorkExperience[],
        education: (resume.education || []) as unknown as Education[],
        skills: (resume.skills || { hard_skills: [], soft_skills: [] }) as ResumeData['skills'],
        certifications: (resume.certifications || []) as unknown as Certification[]
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

  const handleNext = async () => {
    const currentFields = currentStep === 1 
      ? [
          { name: "fullName", label: "Full Name", required: true },
          { name: "email", label: "Email", required: true },
          { name: "phone", label: "Phone Number", required: true }
        ]
      : [
          { name: "title", label: "Job Title", required: true },
          { name: "summary", label: "Professional Summary", required: true }
        ];
    
    const currentSection = currentStep === 1 ? 'personal_info' : 'professional_summary';
    
    // Validate required fields
    const missingFields = currentFields
      .filter(field => field.required && !formData[currentSection][field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-medium">
                {currentStep === 1 ? "Personal Information" : "Professional Summary"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {currentStep === 1 
                  ? "Let's start with your basic information"
                  : "Tell us about your career objectives"
                }
              </p>
            </div>

            {currentStep === 1 ? (
              <PersonalInfoStep
                formData={formData.personal_info}
                onChange={(field, value) => handleInputChange('personal_info', field, value)}
              />
            ) : (
              <ProfessionalSummaryStep
                formData={formData.professional_summary}
                onChange={(field, value) => handleInputChange('professional_summary', field, value)}
              />
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <ResumePreview
              personalInfo={formData.personal_info}
              professionalSummary={formData.professional_summary}
            />
          </Card>
        </div>

        <div className="flex justify-between">
          <Button onClick={handlePrevious} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === TOTAL_STEPS ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
