
import { Award, Briefcase, GraduationCap, User } from "lucide-react";
import { motion } from "framer-motion";

interface QuizProgressProps {
  currentStep: number;
  steps: {
    type: string;
    title: string;
    icon: JSX.Element;
  }[];
}

export function QuizProgress({ currentStep, steps }: QuizProgressProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
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
  );
}

export const quizSteps = [
  { type: "personal_info", title: "Personal Information", icon: <User className="w-6 h-6" /> },
  { type: "work_experience", title: "Work Experience", icon: <Briefcase className="w-6 h-6" /> },
  { type: "education", title: "Education", icon: <GraduationCap className="w-6 h-6" /> },
  { type: "certifications", title: "Certifications", icon: <Award className="w-6 h-6" /> },
];
