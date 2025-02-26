
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WorldMapSection } from "@/components/ui/world-map-section";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <AnimatedHero />
        <Process />
        <Features />
        <WorldMapSection />
        <ResumeTemplates />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
