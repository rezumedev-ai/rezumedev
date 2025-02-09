
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <div className="p-8 text-center bg-gradient-to-br from-accent via-accent/50 to-white rounded-3xl sm:p-16">
          <h2 className="mb-4 text-3xl font-bold text-secondary sm:text-4xl">
            Ready to Transform Your Job Search?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of professionals who've landed their dream jobs with our AI-powered resumes.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105">
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
