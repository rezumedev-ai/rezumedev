
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Process />
      <Features />
      <ResumeTemplates />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
};

export default Index;
