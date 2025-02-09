
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <div className="relative p-8 text-center overflow-hidden bg-gradient-to-br from-accent via-accent/50 to-white rounded-3xl sm:p-16 group">
          {/* Animated background glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-shine" />
          </div>
          <h2 className="relative mb-4 text-3xl font-bold text-secondary animate-fade-up sm:text-4xl">
            Ready to Transform Your Job Search?
          </h2>
          <p className="relative mb-8 text-lg text-muted-foreground animate-fade-up">
            Join thousands of professionals who've landed their dream jobs with our AI-powered resumes.
          </p>
          <button className="relative inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-primary rounded-full hover:bg-primary-hover hover:scale-105 hover:shadow-lg animate-pulse-subtle">
            Start Building Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
