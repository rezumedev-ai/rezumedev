
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface ProgressStep {
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressStepsProps {
  steps: ProgressStep[];
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      {steps.map((step, index) => (
        <Card key={index} className="p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="min-w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base">{step.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </Card>
      ))}
    </div>
  );
}
