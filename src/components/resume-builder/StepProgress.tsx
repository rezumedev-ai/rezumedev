
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-center">Build Your Resume</h1>
      <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      <p className="text-center text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
