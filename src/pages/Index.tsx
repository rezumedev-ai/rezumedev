
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollFeatures } from "@/components/ScrollFeatures";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16">
        <AnimatedHero />
        <ScrollFeatures />
        <Process />
        <Features />
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
