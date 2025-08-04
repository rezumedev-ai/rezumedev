import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { ComparisonTable } from "@/components/ComparisonTable";
import { AnimatedTestimonialsSection } from "@/components/AnimatedTestimonialsSection";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { LandingReviewSection } from "@/components/LandingReviewSection";

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
                  "name": "What is an ATS-friendly resume?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An ATS-friendly resume is designed to be easily read by Applicant Tracking Systems (ATS) that 98% of Fortune 500 companies use to screen resumes. These systems scan for specific keywords, proper formatting, and clear section headers. Our AI resume builder automatically creates ATS-optimized resumes with the right keywords, clean formatting, and industry-standard sections to ensure your resume passes through ATS filters and reaches hiring managers."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I create an ATS-friendly resume?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To create an ATS-friendly resume, use standard section headers (Work Experience, Education, Skills), include relevant keywords from the job description, avoid complex graphics or tables, and use a clean, simple format. Our AI resume builder automatically handles all these requirements, analyzing job descriptions to suggest the right keywords and formatting your resume to meet ATS standards while maintaining visual appeal."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the best resume templates for 2024?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The best resume templates for 2024 focus on clean, modern designs with clear hierarchy and ATS compatibility. Popular styles include minimalist single-column layouts, professional two-column designs, and creative templates for design roles. Our platform offers 20+ professional resume templates that are both visually appealing and ATS-friendly, updated regularly to match current hiring trends and employer preferences."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I download my resume for free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Rezume.dev offers free resume downloads in PDF format. You can create, customize, and download professional resumes without any cost. Our free plan includes access to multiple templates, basic customization options, and unlimited downloads. Premium features like advanced AI suggestions and premium templates are available for users who want additional functionality."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long should my resume be?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For most professionals, a one-page resume is ideal, especially for those with less than 10 years of experience. Senior professionals with extensive experience may use two pages, but never exceed two pages unless you're in academia or research. Our AI resume builder automatically optimizes content length, helping you prioritize the most relevant information while maintaining the appropriate length for your experience level."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What should I include in my professional summary?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A professional summary should be 3-4 lines highlighting your years of experience, key skills, and main achievements. Include industry-specific keywords, quantifiable results, and your career focus. For example: 'Marketing professional with 5+ years driving 40% revenue growth through digital campaigns and data-driven strategies.' Our AI analyzes your background to create compelling, keyword-rich professional summaries tailored to your target roles."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I tailor my resume for specific jobs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tailor your resume by analyzing the job description for keywords, required skills, and qualifications, then adjusting your professional summary, skills section, and work experience descriptions to match. Use the same terminology as the job posting and highlight relevant achievements. Our AI resume builder can analyze job descriptions and automatically suggest content modifications to improve your match rate with specific positions."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What resume format do employers prefer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Employers prefer chronological resume format (most recent experience first) as it's easy to scan and shows career progression clearly. This format works for 90% of job seekers. Functional or combination formats may be used for career changers or those with employment gaps. Our platform defaults to the chronological format while offering flexibility to adjust based on your unique situation and industry requirements."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can I make my resume stand out?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Make your resume stand out by quantifying achievements (increased sales by 25%), using action verbs, including relevant keywords, and maintaining clean formatting. Add a compelling professional summary and ensure your contact information is prominent. Our AI resume builder helps you identify impactful metrics, suggests powerful action verbs, and optimizes formatting to create resumes that catch recruiters' attention while passing ATS screening."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Rezume.dev completely free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Rezume.dev offers a robust free plan that includes resume creation, basic templates, and PDF downloads. You can build professional, ATS-friendly resumes without paying anything. We also offer premium features like advanced AI suggestions, exclusive templates, and enhanced customization options for users who want additional functionality to further optimize their job search success."
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
          <LandingReviewSection />
          <Process />
          <Features />
          <ResumeTemplates />
          <ComparisonTable />
          <PricingSection />
          <AnimatedTestimonialsSection />
          <FAQ />
          <CTA />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
