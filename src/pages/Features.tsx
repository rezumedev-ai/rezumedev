
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";
import { GradientHeading } from "@/components/ui/gradient-heading";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-b from-accent/50 via-white/80 to-white">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="relative mb-6">
                <GradientHeading 
                  variant="resume" 
                  size="lg" 
                  weight="bold" 
                  className="animate-fade-up relative z-10"
                >
                  Powerful Features
                </GradientHeading>
                <div className="absolute -z-10 w-full h-full top-0 left-0 blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
              </div>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-up leading-relaxed" style={{ animationDelay: '100ms' }}>
                Discover how our AI-powered platform makes resume creation effortless,
                professional, and tailored to your career goals
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <FeaturesSection />

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-t from-accent/50 via-white/80 to-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 text-3xl font-bold text-secondary sm:text-4xl animate-fade-up bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: '100ms' }}>
              Join thousands of job seekers who have successfully landed their dream jobs with resumes created using our platform
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
