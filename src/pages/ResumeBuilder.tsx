
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const questions = [
  {
    id: 1,
    title: "Personal Information",
    description: "Let's start with your basic information",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "linkedin", label: "LinkedIn Profile", type: "url", required: false },
      { name: "website", label: "Portfolio/Website", type: "url", required: false }
    ]
  },
  {
    id: 2,
    title: "Professional Summary",
    description: "Tell us about your career objectives",
    fields: [
      { name: "title", label: "Desired Job Title", type: "text", required: true },
      { 
        name: "summary", 
        label: "Professional Summary", 
        type: "textarea", 
        required: true,
        placeholder: "Write 3-4 sentences about your experience and key achievements..."
      }
    ]
  },
  // ... Work Experience, Education, Skills, and Certifications steps will be implemented next
];

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
        personal_info: resume.personal_info || formData.personal_info,
        professional_summary: resume.professional_summary || formData.professional_summary,
        work_experience: resume.work_experience || [],
        education: resume.education || [],
        skills: resume.skills || { hard_skills: [], soft_skills: [] },
        certifications: resume.certifications || []
      });
      setCurrentStep(resume.current_step || 1);
    }
  }, [resume]);

  const saveProgress = async () => {
    const isNew = !id;
    const { data, error } = await supabase
      .from("resumes")
      .upsert({
        id: id || undefined,
        user_id: user?.id,
        title: formData.professional_summary.title || "Untitled Resume",
        personal_info: formData.personal_info,
        professional_summary: formData.professional_summary,
        work_experience: formData.work_experience,
        education: formData.education,
        skills: formData.skills,
        certifications: formData.certifications,
        current_step: currentStep,
        completion_status: currentStep === TOTAL_STEPS ? 'completed' : 'draft'
      })
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
    const currentFields = questions[currentStep - 1].fields;
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

  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Build Your Resume</h1>
          <Progress value={(currentStep / TOTAL_STEPS) * 100} className="w-full" />
          <p className="text-center text-sm text-gray-500">Step {currentStep} of {TOTAL_STEPS}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-medium">{currentQuestion.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{currentQuestion.description}</p>
            </div>

            <div className="space-y-4">
              {currentQuestion.fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={formData[currentStep === 1 ? 'personal_info' : 'professional_summary'][field.name] || ''}
                      onChange={(e) => handleInputChange(
                        currentStep === 1 ? 'personal_info' : 'professional_summary',
                        field.name,
                        e.target.value
                      )}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[currentStep === 1 ? 'personal_info' : 'professional_summary'][field.name] || ''}
                      onChange={(e) => handleInputChange(
                        currentStep === 1 ? 'personal_info' : 'professional_summary',
                        field.name,
                        e.target.value
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="prose max-w-none">
              <div className="space-y-6">
                {/* Personal Information Preview */}
                <div>
                  <h4 className="text-xl font-bold">{formData.personal_info.fullName}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {formData.personal_info.email && (
                      <p>{formData.personal_info.email}</p>
                    )}
                    {formData.personal_info.phone && (
                      <p>{formData.personal_info.phone}</p>
                    )}
                    {formData.personal_info.linkedin && (
                      <p>{formData.personal_info.linkedin}</p>
                    )}
                    {formData.personal_info.website && (
                      <p>{formData.personal_info.website}</p>
                    )}
                  </div>
                </div>

                {/* Professional Summary Preview */}
                {formData.professional_summary.title && (
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {formData.professional_summary.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.professional_summary.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
