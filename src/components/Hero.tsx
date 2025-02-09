
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-transparent" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary sm:text-5xl md:text-6xl">
            Land Your Dream Job with an AI-Tailored Resume
          </h1>
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
            Simply enter your details, and let AI craft a job-winning resume tailored to your industry.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105">
            Build Your Resume Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
