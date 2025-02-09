
import { ArrowRight, FileText, Target, Award, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const companies = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "Disney",
      logo: "/lovable-uploads/1de1d500-e16a-46d6-9037-19cf6739f790.png",
    },
    {
      name: "HCL",
      logo: "/lovable-uploads/d2779dee-4e73-4126-8900-b7d93b6692e3.png",
    },
    {
      name: "Booking.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg",
    },
    {
      name: "DHL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg",
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    }
  ];

  const resumeTemplates = [
    {
      name: "Professional",
      image: "https://placehold.co/600x800/eef2ff/6366f1/png?text=Professional+Resume",
      description: "Perfect for corporate and traditional industries"
    },
    {
      name: "Modern",
      image: "https://placehold.co/600x800/eef2ff/6366f1/png?text=Modern+Resume",
      description: "Ideal for creative and tech roles"
    },
    {
      name: "Executive",
      image: "https://placehold.co/600x800/eef2ff/6366f1/png?text=Executive+Resume",
      description: "Designed for senior positions and leadership roles"
    },
    {
      name: "Simple",
      image: "https://placehold.co/600x800/eef2ff/6366f1/png?text=Simple+Resume",
      description: "Clean and straightforward for any profession"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent/50 to-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNNDAgMzBoNHY0aC00ek0zMiAzMmg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="container relative py-20 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary animate-fade-up sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            Land Your Dream Job with an AI-Tailored Resume
          </h1>
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl animate-fade-up" style={{ animationDelay: '100ms' }}>
            Simply enter your details, and let AI craft a job-winning resume tailored to your industry.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105 shadow-lg hover:shadow-primary/25 animate-fade-up animate-pulse-gentle" style={{ animationDelay: '200ms' }}>
            Build Your Resume Now
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <FileText className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-medium text-muted-foreground">ATS Optimized</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <Target className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Industry Targeted</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <Award className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Top Rated</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Verified Results</p>
            </div>
          </div>

          <div className="mt-20 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <p className="text-sm font-medium text-muted-foreground mb-8">
              OUR USERS GOT HIRED AT
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center">
              {companies.map((company, index) => (
                <div
                  key={company.name}
                  className="group flex items-center justify-center h-16"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-8 w-auto mx-auto grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Templates Showcase */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl mb-6 animate-fade-up">
            Rise Above the Rest with ATS-Optimized Resume Templates
          </h2>
          <p className="text-lg text-muted-foreground mb-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Choose from our professionally designed templates, all crafted to pass ATS systems with flying colors
          </p>

          <div className="relative h-[600px] w-full max-w-4xl mx-auto overflow-hidden">
            <div className="flex gap-6 animate-slide-templates">
              {resumeTemplates.map((template, index) => (
                <div
                  key={template.name}
                  className="relative min-w-[300px] bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative h-[400px] w-full">
                    <img
                      src={template.image}
                      alt={`${template.name} Resume Template`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-semibold text-secondary mb-2">{template.name}</h3>
                    <p className="text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideTemplates {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-300px * 4 - 1.5rem * 4));
          }
        }
        .animate-slide-templates {
          display: flex;
          animation: slideTemplates 20s linear infinite;
        }
        .animate-slide-templates:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
