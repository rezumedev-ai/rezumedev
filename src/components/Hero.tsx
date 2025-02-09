
import { ArrowRight, FileText, Target, Award, CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const companies = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png",
    },
    {
      name: "Disney",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Disney_wordmark_logo.svg",
    },
    {
      name: "HCL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/HCL_Technologies_logo_2021.svg",
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
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Meta_logo.svg",
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent via-accent/50 to-white py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNNDAgMzBoNHY0aC00ek0zMiAzMmg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      <div className="container relative">
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
                  className="group flex items-center justify-center h-12"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-h-8 w-auto mx-auto grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 object-contain"
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
