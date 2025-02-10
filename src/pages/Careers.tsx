
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4 md:mb-6">Join Our Team</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Help us shape the future of resume creation</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 animate-fade-up">
              {positions.map((position, index) => (
                <div 
                  key={position.title}
                  className="p-6 rounded-lg border bg-card"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-secondary">{position.title}</h3>
                      <p className="text-muted-foreground">{position.location}</p>
                    </div>
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <Button variant="outline" className="group">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const positions = [
  {
    title: "Senior Frontend Developer",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a Senior Frontend Developer to help build the next generation of our resume creation platform."
  },
  {
    title: "AI Engineer",
    location: "Remote",
    type: "Full-time",
    description: "Join us in developing cutting-edge AI solutions for resume optimization and content generation."
  },
  // Add more positions as needed
];

export default Careers;
