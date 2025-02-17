
import { ArrowRight, FileText, Target, Award, CheckCircle2, Sparkle } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#1A1F2C] animate-gradient-shift">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_25%)] animate-pulse-slow" />
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.05),transparent_35%)] animate-pulse-slower" />
      </div>

      {/* Content */}
      <div className="container relative py-20 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-block relative mb-4 animate-soft-bounce">
            <Sparkle className="w-6 h-6 text-white absolute -top-3 -right-3 animate-glow" />
            <span className="px-4 py-1.5 text-sm font-medium text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              AI-Powered Resume Builder
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white animate-slide-up-fade sm:text-5xl md:text-6xl">
            Land Your Dream Job with an 
            <span className="bg-gradient-to-r from-[#E5DEFF] to-white bg-clip-text text-transparent"> AI-Tailored Resume</span>
          </h1>
          <p className="mb-10 text-lg text-white/80 sm:text-xl animate-slide-up-fade" style={{ animationDelay: '100ms' }}>
            Simply enter your details, and let AI craft a job-winning resume tailored to your industry.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-primary transition-all bg-white rounded-full hover:bg-gray-100 hover:scale-105 shadow-xl shadow-primary/20 hover:shadow-primary/30 animate-slide-up-fade animate-pulse-gentle backdrop-blur-sm group"
            style={{ animationDelay: '200ms' }}
          >
            Build Your Resume Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-slide-up-fade" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all-smooth hover:scale-105 hover:shadow-lg">
              <FileText className="w-8 h-8 text-white mb-2" />
              <p className="text-sm font-medium text-white/80">ATS Optimized</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all-smooth hover:scale-105 hover:shadow-lg">
              <Target className="w-8 h-8 text-white mb-2" />
              <p className="text-sm font-medium text-white/80">Industry Targeted</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all-smooth hover:scale-105 hover:shadow-lg">
              <Award className="w-8 h-8 text-white mb-2" />
              <p className="text-sm font-medium text-white/80">Top Rated</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-all-smooth hover:scale-105 hover:shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white mb-2" />
              <p className="text-sm font-medium text-white/80">Verified Results</p>
            </div>
          </div>

          <div className="mt-20 animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
            <p className="text-sm font-medium text-white/60 mb-8">
              OUR USERS GOT HIRED AT
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center">
              {companies.map((company, index) => (
                <div
                  key={company.name}
                  className="group flex items-center justify-center h-16 hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-8 w-auto mx-auto brightness-0 invert opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
