
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-accent/50 to-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 relative animate-fade-up">
                <span className="text-secondary">Powerful </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Features
                </span>
                <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-up" style={{ animationDelay: '100ms' }}>
                Discover how our AI-powered platform makes resume creation effortless,
                professional, and tailored to your needs
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/resume-builder">Try Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <FeaturesSection />

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-t from-accent/50 to-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-secondary sm:text-4xl animate-fade-up">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: '100ms' }}>
              Join thousands of job seekers who have successfully landed their dream jobs
            </p>
            <Button size="lg" asChild className="animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Link to="/signup">
                Create Your Resume Now
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
