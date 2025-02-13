
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Briefcase, GraduationCap, Award, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizFlowProps {
  resumeId: string;
  onComplete: () => void;
}

interface QuizStep {
  type: string;
  title: string;
  icon: React.ReactNode;
}

export function QuizFlow({ resumeId, onComplete }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    personal_info: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
    },
    work_experience: [] as any[],
    education: [] as any[],
    certifications: [] as any[],
  });

  const steps: QuizStep[] = [
    { type: "personal_info", title: "Personal Information", icon: <User className="w-6 h-6" /> },
    { type: "work_experience", title: "Work Experience", icon: <Briefcase className="w-6 h-6" /> },
    { type: "education", title: "Education", icon: <GraduationCap className="w-6 h-6" /> },
    { type: "certifications", title: "Certifications", icon: <Award className="w-6 h-6" /> },
  ];

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value,
      }
    }));
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      try {
        const { error } = await supabase
          .from('resumes')
          .update({
            personal_info: formData.personal_info,
            work_experience: formData.work_experience,
            education: formData.education,
            certifications: formData.certifications,
            current_step: 2, // Move to AI assistance step
          })
          .eq('id', resumeId);

        if (error) throw error;
        
        onComplete();
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
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (steps[currentStep].type) {
      case "personal_info":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
              <Input
                value={formData.personal_info.fullName}
                onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <Input
                type="email"
                value={formData.personal_info.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
              <Input
                type="tel"
                value={formData.personal_info.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn Profile</label>
              <Input
                type="url"
                value={formData.personal_info.linkedin}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Portfolio Website</label>
              <Input
                type="url"
                value={formData.personal_info.website}
                onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                placeholder="https://johndoe.com"
              />
            </div>
          </div>
        );
      // Add other step renderers here
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.type}
              className={`flex flex-col items-center ${
                index <= currentStep ? "text-primary" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index <= currentStep ? "bg-primary text-white" : "bg-gray-100"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">{steps[currentStep].title}</h2>
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
