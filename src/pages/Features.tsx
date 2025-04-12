
import { Helmet } from 'react-helmet';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Features = () => {
  const keyFeatures = [
    "AI-Powered Resume Content Generation",
    "ATS-Optimized Templates",
    "Keyword Optimization for Job Descriptions",
    "Real-Time Editing and Preview",
    "Multiple Export Formats (PDF, DOCX, TXT)",
    "Professional Design Templates",
    "Custom Sections and Layouts",
    "Career Progress Tracking"
  ];

  return (
    <>
      <Helmet>
        <title>Features | Rezume.dev - AI Resume Builder & ATS Optimization</title>
        <meta name="description" content="Discover all the powerful features of Rezume.dev's AI-powered resume builder. Create professional, ATS-friendly resumes tailored to your career needs with advanced content optimization." />
        <meta name="keywords" content="resume builder features, ATS resume features, AI resume tools, professional resume formatting, resume templates, keyword optimization, job application tools, career advancement features, resume editor, professional CV generator" />
        <meta name="author" content="Rezume.dev" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://rezume.dev/features" />
        <link rel="icon" type="image/x-icon" href="/custom-favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/custom-favicon.svg" />
        <link rel="shortcut icon" href="/custom-favicon.ico" />
        <link rel="apple-touch-icon" href="/custom-favicon.ico" />
        <meta name="theme-color" content="#9B87F5" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezume.dev/features" />
        <meta property="og:title" content="Features | Rezume.dev - AI Resume Builder" />
        <meta property="og:description" content="Discover all the powerful features of Rezume.dev's AI-powered resume builder. Create professional, ATS-friendly resumes tailored to your career needs." />
        <meta property="og:image" content="https://rezume.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rezume.dev" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rezumedev" />
        <meta name="twitter:title" content="Features | Rezume.dev - AI Resume Builder" />
        <meta name="twitter:description" content="Discover all the powerful features of Rezume.dev's AI-powered resume builder." />
        <meta name="twitter:image" content="https://rezume.dev/og-image.png" />
        
        {/* Features page structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Rezume.dev Features",
              "description": "Discover all the powerful features of Rezume.dev's AI-powered resume builder. Create professional, ATS-friendly resumes tailored to your career needs.",
              "publisher": {
                "@type": "Organization",
                "name": "Rezume.dev",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rezume.dev/custom-favicon.svg"
                }
              },
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  ${keyFeatures.map((feature, index) => `
                    {
                      "@type": "ListItem",
                      "position": ${index + 1},
                      "name": "${feature}"
                    }
                  `).join(',')}
                ]
              }
            }
          `}
        </script>
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

          {/* Key Features List */}
          <section className="py-16 bg-white">
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center text-secondary mb-12">What Sets Us Apart</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start p-6 rounded-lg border bg-card shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary mr-3 flex-shrink-0" />
                    <span className="text-lg text-secondary">{feature}</span>
                  </div>
                ))}
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
              <Button size="lg" className="animate-fade-up" style={{ animationDelay: '200ms' }} asChild>
                <Link to="/">Get Started For Free</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Features;
