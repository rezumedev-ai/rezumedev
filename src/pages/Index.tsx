
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Features } from "@/components/Features";
import { ResumeTemplates } from "@/components/ResumeTemplates";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { lazy, Suspense } from "react";

// Lazy load components that are not immediately visible
const LazyTestimonials = lazy(() => import("@/components/Testimonials"));
const LazyFAQ = lazy(() => import("@/components/FAQ"));
const LazyCTA = lazy(() => import("@/components/CTA"));
const LazyFooter = lazy(() => import("@/components/Footer"));

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-16"> {/* Add padding to account for fixed header */}
        <Hero />
        <Process />
        <Features />
        <ResumeTemplates />
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <LazyTestimonials />
          <LazyFAQ />
          <LazyCTA />
          <LazyFooter />
        </Suspense>
      </div>
    </main>
  );
};

export default Index;
