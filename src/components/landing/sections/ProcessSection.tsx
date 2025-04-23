
import React from "react";
import { Sparkle, UserCircle2, Bot, Download } from "lucide-react";
import { ProcessCard } from "../ui/ProcessCard";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Enter your details",
    description: "Fill in your professional information and job preferences",
    iconName: "UserCircle2" as const
  },
  {
    number: "02",
    title: "AI generates your resume",
    description: "Our AI creates a tailored, ATS-optimized resume",
    iconName: "Bot" as const
  },
  {
    number: "03",
    title: "Download & apply",
    description: "Get your polished resume ready for job applications",
    iconName: "Download" as const
  },
];

export const ProcessSection = () => {
  return (
    <SectionContainer className="py-20 bg-white sm:py-32">
      <div className="container">
        <div className="flex flex-col items-center mb-16 animate-slide-up-fade">
          <SectionHeading 
            badge={{ 
              text: "Simple Process",
              icon: <Sparkle className="w-4 h-4 animate-glow" />
            }}
            title="How It Works"
            titleClassName="mb-4 text-3xl font-bold text-center text-secondary sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover"
          />
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <ProcessCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              iconName={step.iconName}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
