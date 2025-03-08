
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
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
