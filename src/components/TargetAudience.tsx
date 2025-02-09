
import { Users, GraduationCap, ArrowUpRight, Briefcase } from 'lucide-react';

export const TargetAudience = () => {
  const audiences = [
    {
      icon: Users,
      title: "Job Seekers",
      description: "Looking to stand out in competitive job markets",
    },
    {
      icon: ArrowUpRight,
      title: "Career Changers",
      description: "Highlighting transferable skills for new industries",
    },
    {
      icon: GraduationCap,
      title: "Fresh Graduates",
      description: "Making academic achievements work-ready",
    },
    {
      icon: Briefcase,
      title: "Professionals",
      description: "Upgrading resumes for senior positions",
    },
  ];

  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          Who Is This For?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <div
                key={audience.title}
                className="p-6 transition-all border rounded-2xl hover:shadow-lg animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-primary bg-accent rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-secondary">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground">
                  {audience.description}
                </p>
              </div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};
