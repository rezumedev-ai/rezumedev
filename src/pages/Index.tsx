
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnimatedTestimonialsSection } from "@/components/AnimatedTestimonialsSection";
import { ComparisonTable } from "@/components/ComparisonTable";

const Index = () => {
  return (
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
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
