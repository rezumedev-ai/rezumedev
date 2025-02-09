
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/50 to-transparent animate-gradient" />
        {/* Floating abstract elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed" />
      </div>
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary opacity-0 animate-fade-up sm:text-5xl md:text-6xl">
            Land Your Dream Job with an AI-Tailored Resume
          </h1>
          <p className="mb-10 text-lg text-muted-foreground opacity-0 animate-fade-up-delayed sm:text-xl">
            Simply enter your details, and let AI craft a job-winning resume tailored to your industry.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-primary rounded-full hover:bg-primary-hover hover:scale-105 hover:shadow-lg animate-pulse-subtle">
            Build Your Resume Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
