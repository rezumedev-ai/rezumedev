
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AnimatedTestimonialsSection } from "@/components/AnimatedTestimonialsSection";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <main className={`min-h-screen theme-transition ${theme === 'dark' ? 'dark bg-gray-950' : 'bg-white'}`}>
      <Header />
      <div className="pt-12">
        <AnimatedHero />
        <Process />
        <Features />
        <AnimatedTestimonialsSection />
        <ResumeTemplates />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
