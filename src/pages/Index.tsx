
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
import { P5Background } from "@/components/ui/p5-background";
import { P5ResumeLines } from "@/components/ui/p5-resume-lines";

const Index = () => {
  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <P5Background className="opacity-30" />
      </div>
      <Header />
      <div className="pt-12 relative">
        <div className="absolute inset-0 pointer-events-none z-0">
          <P5ResumeLines className="opacity-20" />
        </div>
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
