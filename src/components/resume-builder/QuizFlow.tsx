
import { useState } from "react";
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
import { ResumeData } from "@/types/resume";
import { Json } from "@/integrations/supabase/types";

interface QuizFlowProps {
  resumeId: string;
  onComplete: () => void;
}

export function QuizFlow({ resumeId, onComplete }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
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

  const currentQuestion = questions[currentQuestionIndex];

  const handleInputChange = (value: string) => {
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
        // Cast the arrays to Json[] type to satisfy TypeScript
        const { error } = await supabase
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

        if (error) throw error;
        
        setShowPreview(true);
        await enhanceResume();
      } catch (error) {
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

      onComplete();
    } catch (error) {
      console.error('Error enhancing resume:', error);
      toast({
        title: "Error",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    }
  };

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
