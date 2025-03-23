
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
  return (
    <section className="py-20 bg-white sm:py-32">
      <div className="container">
        <div className="p-8 text-center bg-gradient-to-br from-accent via-white to-accent/50 rounded-3xl sm:p-16 shadow-xl shadow-primary/5">
          <h2 className="mb-4 text-3xl font-bold text-secondary sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            Ready to Transform Your Job Search?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of professionals who've landed their dream jobs with our AI-powered resumes.
          </p>
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-primary rounded-full hover:bg-primary-hover hover:scale-105 shadow-lg hover:shadow-primary/25 animate-pulse-gentle"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          {/* Product Hunt Badge */}
          <div className="mt-8">
            <a 
              href="https://www.producthunt.com/posts/rezume-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-rezume&#0045;2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=945048&theme=light&t=1742703493381" 
                alt="Rezume - Resumes That Make Recruiters Say Yes | Product Hunt" 
                style={{ width: '250px', height: '54px' }} 
                width="250" 
                height="54" 
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
