import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Guides = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4 md:mb-6">Career Guides</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Expert advice to advance your career</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {guides.map((guide, index) => (
              <article 
                key={guide.title}
                className="group rounded-lg border bg-card overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img 
                  src={guide.image} 
                  alt={guide.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{guide.title}</h3>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <Button variant="ghost" className="group" asChild>
                    <Link to={guide.link}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const guides = [
  {
    title: "Resume Writing 101",
    description: "Learn the fundamentals of crafting an effective resume.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    link: "/guides/resume-writing"
  },
  // Add more guides here
];

export default Guides;
