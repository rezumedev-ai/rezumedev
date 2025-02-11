
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Careers = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative animate-fade-up">
              <span className="text-secondary">Join Our </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Team
              </span>
              <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '100ms' }}>
              Help us shape the future of resume creation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
                Exciting Opportunities Coming Soon! 🚀
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're currently working on bringing some amazing career opportunities to our team. 
                Check back soon or follow us on social media to be the first to know when positions become available.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
