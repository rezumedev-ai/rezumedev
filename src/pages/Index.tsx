import { SeoHead } from "@/components/seo/SeoHead";
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
      <SeoHead />
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-12">
          <AnimatedHero />
          <LandingReviewSection />
          <Process />
          <Features />
          <ResumeTemplates />
          <ComparisonTable />
          <AnimatedTestimonialsSection />
          <PricingSection />
          <FAQ />
          <CTA />
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Index;
