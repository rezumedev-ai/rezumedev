
import React from "react";
import { StarIcon } from "lucide-react";

export const LandingReviewSection = () => (
  <section className="py-12 sm:py-14 bg-gradient-to-b from-white to-accent/30">
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      {/* Testimonial Card */}
      <div className="rounded-2xl bg-white shadow-xl border border-[#F1F0FB] p-8 md:p-12 text-center mb-10 relative">
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-5 h-5 text-[#9B87F5] fill-[#9B87F5]" />
          ))}
        </div>
        <blockquote className="font-semibold text-xl md:text-3xl text-[#1A1F2C] leading-relaxed mb-8">
          "I reject 90% of resumes due to bad formatting. Rezume.dev is different—it builds ATS-optimized layouts that recruiters actually love to read. It's the unfair advantage you need."
        </blockquote>
        {/* Reviewer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <img
            src="/uploads/086e725c-a5de-402d-bfd0-4a1a620b0b4f.png"
            alt="Jessica Lee - HR Thought Leader"
            className="rounded-full w-14 h-14 object-cover border-4 border-accent"
            style={{ boxShadow: "0 0 0 4px #E5DEFF" }}
          />
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-semibold text-base text-[#221F26]">Jessica Lee</span>
            <span className="text-xs text-gray-500">Senior Tech Recruiter & Career Coach</span>
          </div>
          {/* "Featured on Rezume.dev" (instead of a logo, brand site theme) */}
          <span className="ml-0 sm:ml-6 mt-3 sm:mt-0 font-bold text-primary text-lg px-3 py-1 rounded bg-accent/60 border border-accent/20">
            Featured on Rezume.dev
          </span>
        </div>
      </div>

    </div>
  </section>
);
