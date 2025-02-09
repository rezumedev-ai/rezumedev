
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { TargetAudience } from "@/components/TargetAudience";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Process />
      <TargetAudience />
      <Features />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Index;
