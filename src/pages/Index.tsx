
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <AuroraBackground className="min-h-[calc(100vh-4rem)]">
        <div className="pt-16 relative z-10">
          <AnimatedHero />
        </div>
      </AuroraBackground>
      <Process />
      <Features />
      <ResumeTemplates />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
