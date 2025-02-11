
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative animate-fade-up">
              <span className="text-secondary">Our </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Story
              </span>
              <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '100ms' }}>
              Empowering careers through AI-powered resumes
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="prose animate-fade-up" style={{ animationDelay: '200ms' }}>
              <p>At Rezume.dev, we believe everyone deserves a chance to showcase their best professional self.</p>
              <p>Our mission is to democratize access to high-quality resume creation tools, powered by the latest AI technology.</p>
            </div>

            <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: '300ms' }}>
              <Button size="lg" asChild>
                <Link to="/contact" className="group">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
