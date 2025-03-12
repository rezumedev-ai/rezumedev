
import { Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { cn } from "@/lib/utils";

export const ComparisonTable = () => {
  const features = [
    { name: "AI-Powered Resume Generation", ours: true, others: false },
    { name: "Free Basic Version", ours: true, others: true },
    { name: "ATS-Friendly Templates", ours: true, others: true },
    { name: "One-Click Format Changes", ours: true, others: false },
    { name: "Real-Time Content Suggestions", ours: true, others: false },
    { name: "Personalized Career Guidance", ours: true, others: false },
    { name: "Export to Multiple Formats", ours: true, others: true },
    { name: "Job-Specific Keyword Optimization", ours: true, others: false },
    { name: "No Watermarks on Free Version", ours: true, others: false },
    { name: "Unlimited Resume Creation", ours: true, others: false },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <GradientHeading
            asChild
            variant="resume"
            size="lg"
            className="mb-4"
          >
            <h2>How We Compare</h2>
          </GradientHeading>
          <p className="text-lg text-muted-foreground">
            See why Rezume.dev stands out from other resume builders
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary/5">
                  <th className="px-6 py-5 text-left text-base font-medium text-secondary">
                    Features
                  </th>
                  <th className="px-6 py-5 text-center text-base font-medium text-primary">
                    Rezume.dev
                  </th>
                  <th className="px-6 py-5 text-center text-base font-medium text-secondary">
                    Other Resume Builders
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={feature.name}
                    className={cn(
                      "border-b border-muted transition-colors hover:bg-muted/20",
                      index % 2 === 0 ? "bg-white" : "bg-muted/10"
                    )}
                  >
                    <td className="px-6 py-4 text-secondary">
                      {feature.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {feature.ours ? (
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-primary rounded-full">
                            <Check className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-400 rounded-full">
                            <X className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {feature.others ? (
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-500 rounded-full">
                            <Check className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-8 h-8 text-white bg-gray-400 rounded-full">
                            <X className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CardContent className="p-6 text-center bg-primary/5">
            <p className="text-sm text-muted-foreground">
              * Comparison based on features available in most popular resume builders as of 2024.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
