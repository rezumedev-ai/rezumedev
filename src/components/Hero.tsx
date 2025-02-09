
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
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
        </div>
      </div>
    </section>
  );
};
