import { Helmet } from 'react-helmet';
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnimatedTestimonialsSection } from "@/components/AnimatedTestimonialsSection";
import ComparisonTable from "@/components/ComparisonTable";
import PricingSection from "@/components/PricingSection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Rezume.dev - Professional AI Resume Builder | Create ATS-Friendly Resumes</title>
        <meta name="description" content="Create stunning, professional, ATS-friendly resumes in minutes with our AI-powered resume builder. Land your dream job faster with expert templates and guidance." />
        <meta name="keywords" content="resume builder, professional resume, AI resume, ATS friendly resume, job application, career advancement, CV maker, resume templates, job search, interview preparation, career tools" />
        <meta name="author" content="Rezume.dev" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://rezume.dev/" />
        <link rel="icon" type="image/x-icon" href="/custom-favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/custom-favicon.svg" />
        <link rel="shortcut icon" href="/custom-favicon.ico" />
        <link rel="apple-touch-icon" href="/custom-favicon.ico" />
        <meta name="theme-color" content="#9B87F5" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezume.dev/" />
        <meta property="og:title" content="Rezume.dev - Professional AI Resume Builder" />
        <meta property="og:description" content="Create stunning, professional, ATS-friendly resumes in minutes with our AI-powered resume builder. Land your dream job faster." />
        <meta property="og:image" content="https://rezume.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rezume.dev" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rezumedev" />
        <meta name="twitter:title" content="Rezume.dev - Professional AI Resume Builder" />
        <meta name="twitter:description" content="Create stunning, professional, ATS-friendly resumes in minutes with our AI-powered resume builder." />
        <meta name="twitter:image" content="https://rezume.dev/og-image.png" />
        
        {/* Enhanced structured data for rich results */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Rezume.dev",
              "url": "https://rezume.dev/",
              "description": "Create stunning, professional, ATS-friendly resumes in minutes with our AI-powered resume builder.",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "operatingSystem": "Web",
              "author": {
                "@type": "Organization",
                "name": "Rezume.dev",
                "url": "https://rezume.dev/",
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
              "potentialAction": {
                "@type": "ViewAction",
                "target": "https://rezume.dev/"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "329",
                "bestRating": "5",
                "worstRating": "1"
              }
            }
          `}
        </script>
        
        {/* FAQPage structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is Rezume.dev free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rezume.dev offers both free and premium plans. The free plan allows you to create basic resumes, while premium plans offer advanced features like ATS optimization, multiple templates, and unlimited downloads."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Are Rezume.dev resumes ATS-friendly?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all Rezume.dev templates are designed to be ATS-friendly, ensuring your resume gets past automated screening systems and into the hands of recruiters."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I download my resume in different formats?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, you can download your resume in PDF, DOCX, and other formats, allowing you to submit your application in whatever format is required."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the AI help with my resume?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI analyzes your input and job descriptions to suggest improvements, optimize keywords, and enhance content to make your resume more effective for specific job applications."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-12">
          <AnimatedHero />
          
          <Process />
          <Features />
          <AnimatedTestimonialsSection />
          <ComparisonTable />
          <ResumeTemplates />
          <FAQ />
          <PricingSection />
          <CTA />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
