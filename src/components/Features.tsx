
import { Check, Shield, Briefcase, MousePointer } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      title: "ATS-Optimized",
      description: "Engineered to pass Applicant Tracking Systems with ease",
      icon: Shield
    },
    {
      title: "Industry-Specific",
      description: "Tailored content matching your target job requirements",
      icon: Briefcase
    },
    {
      title: "Easy to Use",
      description: "Intuitive interface with step-by-step guidance",
      icon: MousePointer
    },
  ];

  return (
    <section className="py-20 bg-accent sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary animate-fade-up sm:text-4xl">
          Why Choose Us?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative p-6 transition-all duration-300 bg-white rounded-2xl hover:shadow-lg group animate-fade-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-white transition-transform duration-300 bg-primary rounded-xl group-hover:scale-110">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/5 to-transparent group-hover:opacity-100 rounded-2xl" />
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
                <Check className="absolute top-4 right-4 w-5 h-5 text-primary opacity-0 transition-all duration-300 scale-50 group-hover:opacity-100 group-hover:scale-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
