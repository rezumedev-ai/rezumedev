
import { Helmet } from 'react-helmet';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Rezume.dev - Professional Resume Builder</title>
        <meta name="description" content="Learn about the story behind Rezume.dev, our mission to empower careers through AI-powered professional resumes, and how we're revolutionizing job applications." />
        <meta name="keywords" content="about rezume.dev, resume builder company, professional resume service, AI resume builder mission, career advancement tool, resume technology, job application assistant" />
        <meta name="author" content="Rezume.dev" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://rezume.dev/about" />
        <link rel="icon" type="image/x-icon" href="/custom-favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/custom-favicon.svg" />
        <link rel="shortcut icon" href="/custom-favicon.ico" />
        <link rel="apple-touch-icon" href="/custom-favicon.ico" />
        <meta name="theme-color" content="#9B87F5" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezume.dev/about" />
        <meta property="og:title" content="About Us | Rezume.dev - Professional Resume Builder" />
        <meta property="og:description" content="Learn about the story behind Rezume.dev, our mission to empower careers through AI-powered professional resumes." />
        <meta property="og:image" content="https://rezume.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rezume.dev" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rezumedev" />
        <meta name="twitter:title" content="About Us | Rezume.dev - Professional Resume Builder" />
        <meta name="twitter:description" content="Learn about the story behind Rezume.dev, our mission to empower careers." />
        <meta name="twitter:image" content="https://rezume.dev/og-image.png" />
        
        {/* About page structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AboutPage",
              "name": "About Rezume.dev",
              "description": "Learn about the story behind Rezume.dev, our mission to empower careers through AI-powered professional resumes.",
              "publisher": {
                "@type": "Organization",
                "name": "Rezume.dev",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://rezume.dev/custom-favicon.svg"
                },
                "sameAs": [
                  "https://twitter.com/rezumedev",
                  "https://linkedin.com/company/rezume-dev",
                  "https://github.com/rezume-dev"
                ]
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://rezume.dev/about"
              }
            }
          `}
        </script>
      </Helmet>
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
                <p>Founded by a team of HR professionals and technology experts, Rezume.dev addresses the common challenges job seekers face when creating resumes that truly represent their skills and experience.</p>
                <p>We've helped thousands of professionals across various industries land interviews and secure positions at leading companies worldwide.</p>
                <h2>Our Approach</h2>
                <p>We combine cutting-edge AI technology with proven resume best practices to create documents that:</p>
                <ul>
                  <li>Pass through Applicant Tracking Systems (ATS)</li>
                  <li>Catch the attention of hiring managers</li>
                  <li>Highlight your unique professional story</li>
                  <li>Adapt to different industries and career levels</li>
                </ul>
                <p>Every template and feature we develop is tested with real recruiters and hiring managers to ensure effectiveness in today's competitive job market.</p>
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
    </>
  );
};

export default About;
