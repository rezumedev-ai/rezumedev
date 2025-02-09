
import { Check, Award, Clock, Download } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Check,
      title: "ATS-Optimized",
      description: "Guaranteed to pass Applicant Tracking Systems with 95% success rate",
    },
    {
      icon: Award,
      title: "Industry-Specific",
      description: "Smart templates tailored to your target industry and role",
    },
    {
      icon: Clock,
      title: "Instant AI Customization",
      description: "Get your perfect resume in minutes, not hours",
    },
    {
      icon: Download,
      title: "One-Click Download",
      description: "Multiple formats ready for immediate application submission",
    },
  ];

  return (
    <section className="py-20 bg-accent sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          Why Choose Us?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 transition-all bg-white rounded-2xl hover:shadow-lg animate-scale-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-white bg-primary rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};
