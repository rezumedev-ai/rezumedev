
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4 md:mb-6">Powerful Features</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Everything you need to create the perfect resume</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-lg border bg-card animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-up">
            <Button size="lg" asChild>
              <Link to="/signup" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const features = [
  {
    title: "AI-Powered Writing",
    description: "Let our AI help you craft the perfect professional summary and bullet points.",
    icon: ArrowRight
  },
  // Add more features here
];

export default Features;
