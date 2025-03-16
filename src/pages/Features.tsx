
import { Helmet } from 'react-helmet';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features | Rezume.dev - AI Resume Builder</title>
        <meta name="description" content="Discover all the powerful features of Rezume.dev's AI-powered resume builder. Create professional, ATS-friendly resumes tailored to your career needs." />
        <meta name="keywords" content="resume builder features, ATS resume features, AI resume tools, professional resume formatting, resume templates" />
        <link rel="canonical" href="https://rezume.dev/features" />
      </Helmet>
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Features;
