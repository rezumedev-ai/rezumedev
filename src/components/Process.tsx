
import { UserCircle2, Bot, Download, Sparkle } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Enter your details",
      description: "Fill in your professional information and job preferences",
      icon: UserCircle2
    },
    {
      number: "02",
      title: "AI generates your resume",
      description: "Our AI creates a tailored, ATS-optimized resume",
      icon: Bot
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
        <div className="flex flex-col items-center mb-16 animate-slide-up-fade">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Sparkle className="w-4 h-4 animate-glow" />
            <span>Simple Process</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-center text-secondary sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            How It Works
          </h2>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group p-6 transition-all bg-white rounded-2xl hover:shadow-xl animate-slide-up-fade relative overflow-hidden hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-semibold text-primary bg-accent rounded-xl group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
