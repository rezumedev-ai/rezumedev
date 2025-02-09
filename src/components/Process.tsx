
import { FileText, Wand2, Download } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Enter your details",
      description: "Fill in your professional information and job preferences",
      icon: FileText
    },
    {
      number: "02", 
      title: "AI generates your resume",
      description: "Our AI creates a tailored, ATS-optimized resume",
      icon: Wand2
    },
    {
      number: "03",
      title: "Download & apply",
      description: "Get your polished resume ready for job applications",
      icon: Download
    },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary animate-fade-up sm:text-4xl">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="p-6 transition-all duration-300 bg-white rounded-2xl hover:shadow-lg group animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-semibold transition-transform duration-300 group-hover:scale-110 text-primary bg-accent rounded-xl">
                  <Icon className="w-6 h-6" />
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
