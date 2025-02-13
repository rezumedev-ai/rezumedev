import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Briefcase, GraduationCap, Award, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkExperienceStep } from "./WorkExperienceStep";
import { EducationStep } from "./EducationStep";
import { CertificationsStep } from "./CertificationsStep";
import { ResumePreview } from "./ResumePreview";

interface QuizFlowProps {
  resumeId: string;
  onComplete: () => void;
}

interface Question {
  id: string;
  text: string;
  type: string;
  field: string;
  required: boolean;
  placeholder: string;
  inputType: string;
}

export function QuizFlow({ resumeId, onComplete }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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
    work_experience: [] as any[],
    education: [] as any[],
    certifications: [] as any[],
    skills: {
      hard_skills: [] as string[],
      soft_skills: [] as string[],
    }
  });

  const steps = [
    { type: "personal_info", title: "Personal Information", icon: <User className="w-6 h-6" /> },
    { type: "professional_summary", title: "Job Title", icon: <Briefcase className="w-6 h-6" /> },
    { type: "work_experience", title: "Work Experience", icon: <Briefcase className="w-6 h-6" /> },
    { type: "education", title: "Education", icon: <GraduationCap className="w-6 h-6" /> },
    { type: "certifications", title: "Certifications", icon: <Award className="w-6 h-6" /> },
  ];

  const questions: Question[] = [
    {
      id: "fullName",
      text: "What's your full name?",
      type: "personal_info",
      field: "fullName",
      required: true,
      placeholder: "John Doe",
      inputType: "text"
    },
    {
      id: "email",
      text: "What's your email address?",
      type: "personal_info",
      field: "email",
      required: true,
      placeholder: "john@example.com",
      inputType: "email"
    },
    {
      id: "phone",
      text: "What's your phone number?",
      type: "personal_info",
      field: "phone",
      required: true,
      placeholder: "+1 (555) 000-0000",
      inputType: "tel"
    },
    {
      id: "linkedin",
      text: "Share your LinkedIn profile URL",
      type: "personal_info",
      field: "linkedin",
      required: false,
      placeholder: "https://linkedin.com/in/johndoe",
      inputType: "url"
    },
    {
      id: "website",
      text: "Do you have a portfolio website?",
      type: "personal_info",
      field: "website",
      required: false,
      placeholder: "https://johndoe.com",
      inputType: "url"
    },
    {
      id: "jobTitle",
      text: "What's your desired job title?",
      type: "professional_summary",
      field: "title",
      required: true,
      placeholder: "e.g. Senior Software Engineer",
      inputType: "text"
    }
  ];

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
    if (currentStep === steps.length - 1) {
      await enhanceResume();
    } else {
      try {
        const { error } = await supabase
          .from('resumes')
          .update({
            personal_info: formData.personal_info,
            professional_summary: formData.professional_summary,
            work_experience: formData.work_experience,
            education: formData.education,
            certifications: formData.certifications,
            current_step: currentStep + 1,
          })
          .eq('id', resumeId);

        if (error) throw error;
        
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save your information. Please try again.",
          variant: "destructive",
        });
      }
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

  const handleFinish = async () => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({
          completion_status: 'completed'
        })
        .eq('id', resumeId);

      if (error) throw error;
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const enhanceResume = async () => {
    setIsEnhancing(true);
    try {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .update({
          personal_info: formData.personal_info,
          professional_summary: formData.professional_summary,
          work_experience: formData.work_experience,
          education: formData.education,
          certifications: formData.certifications,
          current_step: currentStep + 1,
        })
        .eq('id', resumeId)
        .select()
        .single();

      if (resumeError) throw resumeError;

      const { data, error } = await supabase.functions.invoke('enhance-resume', {
        body: { resumeData }
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        professional_summary: {
          ...prev.professional_summary,
          summary: data.suggestions.professional_summary
        },
        skills: data.suggestions.skills,
        work_experience: prev.work_experience.map((exp, idx) => ({
          ...exp,
          responsibilities: data.suggestions.enhanced_work_experience[idx]?.responsibilities || exp.responsibilities
        }))
      }));

      toast({
        title: "Resume Enhanced",
        description: "Your resume has been optimized with AI suggestions.",
      });

      setShowPreview(true);
    } catch (error) {
      console.error('Error enhancing resume:', error);
      toast({
        title: "Error",
        description: "Failed to enhance resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (showPreview) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Preview Your Enhanced Resume</h2>
          <ResumePreview
            personalInfo={formData.personal_info}
            professionalSummary={formData.professional_summary}
            workExperience={formData.work_experience}
            education={formData.education}
            skills={formData.skills}
            certifications={formData.certifications}
            isEditable={true}
            onUpdate={(section, value) => {
              setFormData(prev => ({
                ...prev,
                [section]: value
              }));
            }}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Edit Resume
          </Button>
          <Button onClick={handleFinish}>
            Complete Resume
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (steps[currentStep].type) {
      case "personal_info":
      case "professional_summary":
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-6"
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentQuestion.text}
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type={currentQuestion.inputType}
                  value={
                    currentQuestion.type === "professional_summary"
                      ? formData.professional_summary[currentQuestion.field as keyof typeof formData.professional_summary]
                      : formData.personal_info[currentQuestion.field as keyof typeof formData.personal_info]
                  }
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  required={currentQuestion.required}
                  className="text-lg p-6 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                {currentQuestion.required && (
                  <p className="text-sm text-gray-500 mt-2">* Required field</p>
                )}
              </motion.div>
            </motion.div>
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.type}
                className={`flex flex-col items-center ${
                  index <= currentStep ? "text-primary" : "text-gray-400"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                    index <= currentStep ? "bg-primary text-white" : "bg-gray-100"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </motion.div>
            ))}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

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
            {currentStep === steps.length - 1 ? "Complete" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>

        <motion.div 
          className="mt-4 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Step {currentStep + 1} of {steps.length}
        </motion.div>
      </div>
    </div>
  );
}
