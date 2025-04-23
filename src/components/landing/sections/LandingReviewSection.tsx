
import React from "react";
import { StarIcon, UsersIcon, ThumbsUpIcon } from "lucide-react";
import { TestimonialCard } from "../ui/TestimonialCard";
import { StatCard } from "../ui/StatCard";
import { SectionContainer } from "../ui/SectionContainer";

export const LandingReviewSection = () => (
  <SectionContainer className="py-12 sm:py-14 bg-gradient-to-b from-white to-accent/30">
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      {/* Testimonial Card */}
      <TestimonialCard
        quote="Rezume.dev is a truly powerful AI resume builder that offers ATS-friendly templates and actionable suggestions to land more interviews. It's the perfect jumpstart to creating your professional resume with confidence."
        author={{
          name: "Jessica Lee",
          title: "HR Thought Leader",
          imageSrc: "/lovable-uploads/086e725c-a5de-402d-bfd0-4a1a620b0b4f.png",
        }}
        badgeText="Featured on Rezume.dev"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={UsersIcon}
          label="Total Users"
          value="212,400+"
          color="#7E69AB"
        />
        <StatCard 
          icon={ThumbsUpIcon}
          label="Interview Rate"
          value="64.7%"
          color="#9B87F5"
        />
        <StatCard 
          icon={StarIcon}
          label="Avg. User Review"
          value="8.8/10"
          color="#403E43"
          iconColor="#FEC6A1"
          iconFill="#FEC6A1"
        />
      </div>
    </div>
  </SectionContainer>
);
