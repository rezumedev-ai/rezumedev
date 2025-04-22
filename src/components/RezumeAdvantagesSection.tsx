
import { Rocket, Shield, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI-Powered Resume Generation",
    description: "Generate stunning, personalized, and impactful resumes in seconds—powered by advanced AI tuned for modern recruiters.",
    icon: Sparkles,
    gradient: "from-[#9b87f5]/80 to-[#e1e4f7]/80"
  },
  {
    title: "ATS-Optimized Templates",
    description: "All our templates are meticulously crafted for top compatibility with Applicant Tracking Systems (ATS) and real-world recruiters.",
    icon: Shield,
    gradient: "from-[#f5d0fe]/80 to-[#e0e7ff]/80"
  },
  {
    title: "Instant Real-Time Suggestions",
    description: "Get actionable, career-boosting insights as you build—industry-specific phrasing, skill highlighting, and instant feedback.",
    icon: Rocket,
    gradient: "from-[#7dd3fc]/80 to-[#e0e7ff]/80"
  },
  {
    title: "Unlimited PDF Downloads",
    description: "Export as many resumes as you wish with a single click. No watermarks, no limits—just professional results.",
    icon: Shield,
    gradient: "from-[#bbf7d0]/80 to-[#f1f5f9]/80"
  },
  {
    title: "Free to Start, No Surprises",
    description: "Build and download your resume for free. Premium features are available—no hidden fees, ever.",
    icon: Sparkles,
    gradient: "from-[#ffe29f]/80 to-[#ff719a]/60"
  },
];

export function RezumeAdvantagesSection() {
  return (
    <section className="pt-6 pb-20 px-4 sm:px-8 bg-gradient-to-b from-white via-slate-50 to-accent/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent drop-shadow-lg">
              Why Choose Rezume.dev?
            </span>
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
            Designed for top performance—Rezume.dev gives every applicant the tools, technology, and polish that make them stand out, instantly.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-2xl shadow-xl group transition-transform duration-200 border border-accent/40 bg-white/60 hover:-translate-y-1",
                "relative overflow-hidden"
              )}
              style={{
                background:
                  "linear-gradient(135deg, " +
                  (feature.gradient ?? "from-white to-accent/30") +
                  ")"
              }}
            >
              <div className="absolute inset-0 z-0 pointer-events-none opacity-30 blur-xl"
                style={{
                  background:
                    `linear-gradient(120deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                }}
              />
              <div className="relative z-10 flex flex-col gap-3 items-start p-7">
                <span className="inline-flex items-center justify-center bg-white/60 border border-gray-200 rounded-full w-11 h-11 mb-3 shadow">
                  <feature.icon className="text-primary w-7 h-7" />
                </span>
                <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 text-[15px]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <span className="inline-block rounded-full bg-gradient-to-r from-primary/80 to-violet-400 px-5 py-2 text-white font-semibold text-xl shadow-md">
            Build your new resume with confidence—no compromises.
          </span>
        </div>
      </div>
    </section>
  );
}

export default RezumeAdvantagesSection;
