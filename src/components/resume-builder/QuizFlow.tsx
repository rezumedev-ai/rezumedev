
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkExperienceStep } from "./WorkExperienceStep";
import { EducationStep } from "./EducationStep";
import { CertificationsStep } from "./CertificationsStep";
import { ResumePreview } from "./ResumePreview";
import { QuestionForm } from "./quiz/QuestionForm";
import { QuizProgress, quizSteps } from "./quiz/QuizProgress";
import { questions } from "./quiz/questions";
import { ResumeData, WorkExperience, Education, Certification } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";
import { LoadingState } from "./LoadingState";
import { useQuery } from "@tanstack/react-query";

interface QuizFlowProps {
  resumeId: string;
  onComplete: () => void;
}

export function QuizFlow({ resumeId, onComplete }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ResumeData>({
    personal_info: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
    },
    professional_summary: {
      title: "",
      summary: ""
    },
    work_experience: [],
    education: [],
    certifications: [],
    skills: {
      hard_skills: [],
      soft_skills: [],
    }
  });

  const convertWorkExperience = (json: Json[] | null): WorkExperience[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const exp = item as Record<string, unknown>;
      if (
        typeof exp.jobTitle === 'string' &&
        typeof exp.companyName === 'string' &&
        typeof exp.startDate === 'string' &&
        typeof exp.endDate === 'string' &&
        Array.isArray(exp.responsibilities)
      ) {
        const workExp: WorkExperience = {
          jobTitle: exp.jobTitle,
          companyName: exp.companyName,
          startDate: exp.startDate,
          endDate: exp.endDate,
          responsibilities: exp.responsibilities.filter((r): r is string => typeof r === 'string')
        };

        if (typeof exp.location === 'string') {
          workExp.location = exp.location;
        }
        if (typeof exp.isCurrentJob === 'boolean') {
          workExp.isCurrentJob = exp.isCurrentJob;
        }

        return workExp;
      }
      return null;
    }).filter((item): item is WorkExperience => item !== null);
  };

  const convertEducation = (json: Json[] | null): Education[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const edu = item as Record<string, unknown>;
      if (
        typeof edu.degreeName === 'string' &&
        typeof edu.schoolName === 'string' &&
        typeof edu.startDate === 'string' &&
        typeof edu.endDate === 'string'
      ) {
        const education: Education = {
          degreeName: edu.degreeName,
          schoolName: edu.schoolName,
          startDate: edu.startDate,
          endDate: edu.endDate
        };

        if (typeof edu.isCurrentlyEnrolled === 'boolean') {
          education.isCurrentlyEnrolled = edu.isCurrentlyEnrolled;
        }

        return education;
      }
      return null;
    }).filter((item): item is Education => item !== null);
  };

  const convertCertifications = (json: Json[] | null): Certification[] => {
    if (!Array.isArray(json)) return [];
    return json.map(item => {
      if (typeof item !== 'object' || !item) return null;
      const cert = item as Record<string, unknown>;
      if (
        typeof cert.name === 'string' &&
        typeof cert.organization === 'string' &&
        typeof cert.completionDate === 'string'
      ) {
        return {
          name: cert.name,
          organization: cert.organization,
          completionDate: cert.completionDate
        };
      }
      return null;
    }).filter((item): item is Certification => item !== null);
  };

  // Fetch existing resume data and quiz responses
  const { data: existingData } = useQuery({
    queryKey: ['resume-data', resumeId],
    queryFn: async () => {
      const [resumeResponse, quizResponse] = await Promise.all([
        supabase.from('resumes').select('*').eq('id', resumeId).single(),
        supabase.from('resume_quiz_responses').select('*').eq('resume_id', resumeId)
      ]);

      if (resumeResponse.error) throw resumeResponse.error;
      
      return {
        resume: resumeResponse.data,
        quizResponses: quizResponse.data || []
      };
    }
  });

  useEffect(() => {
    if (existingData?.resume) {
      const resume = existingData.resume;
      setFormData({
        personal_info: resume.personal_info as ResumeData['personal_info'] || formData.personal_info,
        professional_summary: resume.professional_summary as ResumeData['professional_summary'] || formData.professional_summary,
        work_experience: convertWorkExperience(resume.work_experience),
        education: convertEducation(resume.education),
        certifications: convertCertifications(resume.certifications),
        skills: resume.skills as ResumeData['skills'] || { hard_skills: [], soft_skills: [] }
      });

      const lastResponse = existingData.quizResponses
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      if (lastResponse) {
        const questionIndex = questions.findIndex(q => q.field === lastResponse.question_key);
        if (questionIndex !== -1) {
          setCurrentQuestionIndex(questionIndex);
        }
      }
    }
  }, [existingData]);

  const currentQuestion = questions[currentQuestionIndex];

  const saveQuizResponse = async (field: string, value: any) => {
    try {
      await supabase.from('resume_quiz_responses').insert({
        resume_id: resumeId,
        question_key: field,
        response: value
      });

      if (currentQuestion.type === "professional_summary") {
        await supabase
          .from('resumes')
          .update({
            professional_summary: {
              ...formData.professional_summary,
              [field]: value
            }
          })
          .eq('id', resumeId);
      } else {
        await supabase
          .from('resumes')
          .update({
            personal_info: {
              ...formData.personal_info,
              [field]: value
            }
          })
          .eq('id', resumeId);
      }
    } catch (error) {
      console.error('Error saving quiz response:', error);
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = async (value: string) => {
    if (currentQuestion.type === "professional_summary") {
      setFormData(prev => ({
        ...prev,
        professional_summary: {
          ...prev.professional_summary,
          [currentQuestion.field]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          [currentQuestion.field]: value,
        }
      }));
    }
    
    await saveQuizResponse(currentQuestion.field, value);
  };

  const handleNext = async () => {
    const currentValue = currentQuestion.type === "professional_summary" 
      ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary]
      : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info];

    if (currentQuestion.required && !currentValue) {
      toast({
        title: "Required Field",
        description: "Please fill out this field to continue",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleStepComplete = async () => {
    if (currentStep === quizSteps.length - 1) {
      try {
        setIsEnhancing(true);
        await supabase
          .from('resumes')
          .update({
            personal_info: formData.personal_info as Json,
            professional_summary: formData.professional_summary as Json,
            work_experience: formData.work_experience as unknown as Json[],
            education: formData.education as unknown as Json[],
            certifications: formData.certifications as unknown as Json[],
            completion_status: 'enhancing'
          })
          .eq('id', resumeId);
        
        await enhanceResume();
      } catch (error) {
        setIsEnhancing(false);
        toast({
          title: "Error",
          description: "Failed to save your information. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const enhanceResume = async () => {
    try {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();

      if (resumeError) throw resumeError;

      const { error } = await supabase.functions.invoke('enhance-resume', {
        body: { resumeData }
      });

      if (error) throw error;

      const checkEnhancement = setInterval(async () => {
        const { data, error } = await supabase
          .from('resumes')
          .select('completion_status')
          .eq('id', resumeId)
          .single();

        if (error) {
          clearInterval(checkEnhancement);
          throw error;
        }

        if (data.completion_status === 'completed') {
          clearInterval(checkEnhancement);
          onComplete();
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(checkEnhancement);
        setIsEnhancing(false);
        toast({
          title: "Enhancement taking longer than expected",
          description: "Please try again later.",
          variant: "destructive",
        });
      }, 120000);

    } catch (error) {
      console.error('Error enhancing resume:', error);
      setIsEnhancing(false);
      toast({
        title: "Error",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEnhancing) {
    return <LoadingState status="enhancing" />;
  }

  const renderStep = () => {
    switch (quizSteps[currentStep].type) {
      case "personal_info":
      case "professional_summary":
        return (
          <AnimatePresence mode="wait">
            <QuestionForm
              question={currentQuestion}
              value={
                currentQuestion.type === "professional_summary"
                  ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary] as string
                  : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info] as string
              }
              onChange={handleInputChange}
            />
          </AnimatePresence>
        );
      case "work_experience":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <WorkExperienceStep
              formData={formData.work_experience}
              onChange={(experiences) => setFormData(prev => ({ ...prev, work_experience: experiences }))}
              hideAiSuggestions={true}
            />
          </motion.div>
        );
      case "education":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EducationStep
              formData={formData.education}
              onChange={(education) => setFormData(prev => ({ ...prev, education }))}
            />
          </motion.div>
        );
      case "certifications":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CertificationsStep
              formData={formData.certifications}
              onChange={(certifications) => setFormData(prev => ({ ...prev, certifications }))}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl w-full mx-auto p-6">
        <QuizProgress currentStep={currentStep} steps={quizSteps} />

        <motion.div
          className="relative bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 border border-gray-100"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>

        <motion.div 
          className="mt-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 && currentQuestionIndex === 0}
            className="transition-all duration-300 hover:shadow-md"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button 
            onClick={currentQuestionIndex === questions.length - 1 ? handleStepComplete : handleNext}
            className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-md"
          >
            {currentStep === quizSteps.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div 
          className="mt-4 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Step {currentStep + 1} of {quizSteps.length}
        </motion.div>
      </div>
    </div>
  );
}
