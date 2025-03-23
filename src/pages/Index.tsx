
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
        <title>Rezume.dev - Create Professional Resumes</title>
        <meta name="description" content="Create stunning, professional, ATS-friendly resumes in minutes with our AI-powered resume builder. Land your dream job faster." />
        <meta name="keywords" content="resume builder, professional resume, AI resume, ATS friendly resume, job application, career advancement, CV maker" />
        <link rel="canonical" href="https://rezume.dev/" />
      </Helmet>
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-12">
          <AnimatedHero />
          
          {/* Product Hunt Badge */}
          <div className="container mx-auto text-center py-4">
            <a 
              href="https://www.producthunt.com/posts/rezume-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-rezume&#0045;2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <img 
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=945048&theme=light&t=1742703493381" 
                alt="Rezume - Resumes That Make Recruiters Say Yes | Product Hunt" 
                style={{ width: '250px', height: '54px' }} 
                width="250" 
                height="54" 
              />
            </a>
          </div>
          
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
