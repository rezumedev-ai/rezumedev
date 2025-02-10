
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Build Your Resume</h1>
        <p className="text-sm text-gray-500">Complete each section to create your professional resume</p>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-2 bg-gray-100" />
      <div className="flex justify-between items-center text-sm">
        <span className="text-primary font-medium">Step {currentStep} of {totalSteps}</span>
        <span className="text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
    </div>
  );
}
