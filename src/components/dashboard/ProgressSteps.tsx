
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
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={index} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  );
}
