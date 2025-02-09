
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/50 to-transparent" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-secondary sm:text-5xl md:text-6xl">
            Your AI-Powered Resume, Tailored to Get You Hired Faster
          </h1>
          <p className="mb-6 text-lg text-muted-foreground sm:text-xl">
            Simply enter your details, and let AI craft a job-winning resume tailored to your industry.
          </p>
          <div className="mb-8">
            <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105">
              Get Your AI-Optimized Resume in Minutes – Start Free!
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-muted-foreground">
              No credit card required | Instant download
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 p-4 bg-white/80 rounded-xl backdrop-blur-sm">
            <p className="text-sm font-medium text-muted-foreground">Trusted by 10,000+ job seekers</p>
            <div className="w-px h-6 bg-border"></div>
            <p className="text-sm font-medium text-muted-foreground">95% interview success rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};
