
import { Rocket, Shield, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import React from "react";

// Animated fade-in-up
function classWithDelay(base: string, idx: number) {
  return `${base} animate-fade-up opacity-0 will-change-transform will-change-opacity animation-delay-${idx + 1}`;
}

// Utility for animation delays
const animationDelays = [
  "delay-0",
  "delay-75",
  "delay-150",
  "delay-200",
  "delay-300",
  "delay-400",
];

const features = [
  {
    title: "AI-Powered Resume Generation",
    description: "Generate stunning, personalized, and impactful resumes in seconds—powered by advanced AI tuned for modern recruiters.",
    icon: Sparkles,
    gradientShadow: "from-[#a28fffbb] via-[#f6ecff77] to-[#e1e4f766]",
    blob: "bg-gradient-to-tr from-[#b3a6f8] via-[#ffe4e5] to-[#e1e4f7]",
  },
  {
    title: "ATS-Optimized Templates",
    description: "All our templates are meticulously crafted for top compatibility with Applicant Tracking Systems (ATS) and real-world recruiters.",
    icon: Shield,
    gradientShadow: "from-[#e9b7fb99] via-[#f1cfff55] to-[#e0e7ffaa]",
    blob: "bg-gradient-to-br from-[#f5d0fe] via-[#c7eaff] to-[#e0e7ff]",
  },
  {
    title: "Instant Real-Time Suggestions",
    description: "Get actionable, career-boosting insights as you build—industry-specific phrasing, skill highlighting, and instant feedback.",
    icon: Rocket,
    gradientShadow: "from-[#5ee5fa88] via-[#a5e9fc66] to-[#e0e7ff99]",
    blob: "bg-gradient-to-br from-[#7dd3fc] via-[#f1e8ff] to-[#e0e7ff]",
  },
  {
    title: "Unlimited PDF Downloads",
    description: "Export as many resumes as you wish with a single click. No watermarks, no limits—just professional results.",
    icon: Shield,
    gradientShadow: "from-[#bbf7d0cc] via-[#e3ffee33] to-[#f1f5f9bb]",
    blob: "bg-gradient-to-br from-[#bbf7d0] via-[#eafffe] to-[#f1f5f9]",
  },
  {
    title: "Free to Start, No Surprises",
    description: "Build and download your resume for free. Premium features are available—no hidden fees, ever.",
    icon: Sparkles,
    gradientShadow: "from-[#ffe29fcc] via-[#ffb4e055] to-[#ff719a99]",
    blob: "bg-gradient-to-br from-[#ffe29f] via-[#ffc1ea] to-[#ff719a]",
  },
];

export function RezumeAdvantagesSection() {
  return (
    <section className="relative py-10 sm:py-16 px-2 bg-gradient-to-b from-white via-slate-50 to-accent/30 overflow-hidden">
      {/* Animated Gradient Blob: Desktop only */}
      <div
        className={cn(
          "hidden sm:block absolute -top-56 left-1/2 -translate-x-1/2 z-0 opacity-60 pointer-events-none",
        )}
        aria-hidden="true"
      >
        <div className="w-[900px] h-[600px] rounded-full filter blur-3xl bg-gradient-to-tr from-[#b6cafc] via-[#ede6fa] to-[#ffe3ea] animate-pulse" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent drop-shadow-lg">
            Why Choose Rezume.dev?
          </h2>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Effortlessly stand out: smarter, faster, and beautifully designed resumes—let Rezume.dev do the hard work for you.
          </p>
        </div>
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {/* Decorative accent blobs in z-0 per row (desktop only) */}
          <div className="pointer-events-none absolute z-0 -left-20 top-1/4 w-64 h-64 hidden lg:block blur-2xl opacity-25"
            aria-hidden="true"
            style={{
              background: "linear-gradient(120deg, #9b87f5 0%, #e1e4f7 100%)"
            }}
          />
          <div className="pointer-events-none absolute z-0 -right-24 bottom-0 w-56 h-56 hidden lg:block blur-2xl opacity-15"
            aria-hidden="true"
            style={{
              background: "linear-gradient(120deg, #ffe29f 0%, #ff719a 100%)"
            }}
          />
          {/* Each Advantage Card */}
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                // Card (glass, shadow, hover)
                "relative group rounded-3xl bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl p-7 min-h-[256px] flex flex-col items-start justify-between overflow-hidden ring-1 ring-accent/20 shadow-2xl",
                "hover:scale-[1.025] transition-transform duration-300 ease-[cubic-bezier(.76,.02,.41,.99)]",
                classWithDelay("", idx),
                animationDelays[idx % animationDelays.length], // animate-fade-up delay
              )}
              style={{
                animation: `fade-up 0.6s cubic-bezier(.22,.68,.56,1.02) forwards`,
                animationDelay: `${0.13 * idx + 0.2}s`
              }}
            >
              {/* Colorful blurred accent shadow */}
              <div
                className={cn(
                  "absolute -inset-3 z-0 blur-2xl opacity-60 pointer-events-none",
                )}
                style={{
                  background: `linear-gradient(120deg, ${feature.gradientShadow})`
                }}
                aria-hidden="true"
              />
              <span className={cn(
                "relative z-10 inline-flex items-center justify-center bg-white/70 dark:bg-neutral-900/50 border border-accent/30 rounded-full w-12 h-12 mb-5 shadow-lg",
                "transition-transform group-hover:-translate-y-1"
              )}>
                <feature.icon className="text-primary w-7 h-7" />
              </span>
              <h3 className="relative z-10 font-bold text-xl tracking-tight text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="relative z-10 text-gray-700 dark:text-gray-300 text-base leading-snug">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <span className="inline-block rounded-full bg-gradient-to-r from-primary/80 to-violet-400 px-7 py-3 text-white font-semibold text-xl shadow-xl backdrop-blur-sm animate-pulse">
            Build your new resume with confidence—no compromises.
          </span>
        </div>
      </div>
      {/* Mobile BG accent – more subtle */}
      <div className="sm:hidden absolute -top-[100px] -right-[100px] w-[250px] h-[250px] z-0 opacity-20 pointer-events-none" style={{
        background: "linear-gradient(120deg,#ffe29f,#ff719a)",
        borderRadius: "45% 55% 60% 40% / 60% 45% 55% 40%"
      }}></div>
    </section>
  );
}

export default RezumeAdvantagesSection;

