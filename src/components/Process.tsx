
import { FileText, Cpu, Download } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      icon: FileText,
      number: "01",
      title: "Enter Your Details",
      description: "Add your experience, skills, and preferences",
    },
    {
      icon: Cpu,
      number: "02",
      title: "AI Crafts Your Resume",
      description: "Optimized for ATS & your industry",
    },
    {
      icon: Download,
      number: "03",
      title: "Download & Apply",
      description: "Ready to impress recruiters instantly",
    },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 transition-all bg-white rounded-2xl hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 text-primary bg-accent rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
};
