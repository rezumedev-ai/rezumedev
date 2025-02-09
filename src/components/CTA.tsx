
import { ArrowRight } from 'lucide-react';

export const CTA = () => {
  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <div className="p-8 text-center bg-gradient-to-br from-accent via-accent/50 to-white rounded-3xl sm:p-16">
          <h2 className="mb-4 text-3xl font-bold text-secondary sm:text-4xl">
            Ready to Transform Your Job Search?
          </h2>
          <p className="mb-4 text-lg text-muted-foreground">
            Join thousands of professionals who've landed their dream jobs with our AI-powered resumes.
          </p>
          <div className="mb-8">
            <button className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105">
              Get Your AI-Optimized Resume Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-muted-foreground">
              Join 10,000+ successful job seekers
            </p>
          </div>
          <div className="px-4 py-3 mx-auto text-sm text-center text-muted-foreground bg-white/80 rounded-xl backdrop-blur-sm max-w-max">
            "I landed my dream job at Google using this AI resume builder!" - John D.
          </div>
        </div>
      </div>
    </section>
  );
};
