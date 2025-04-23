
import React from "react";
import { StarIcon, UserIcon, ThumbsUpIcon, UsersIcon } from "lucide-react";

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
          Rezume.dev is a truly powerful AI resume builder that offers ATS-friendly templates and actionable suggestions to land more interviews. It's the perfect jumpstart to creating your professional resume with confidence.
        </blockquote>
        {/* Reviewer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <img
            src="/lovable-uploads/a41674ee-049d-4ade-88a0-17f53696a879.png"
            alt="Jessica Lee - HR Thought Leader"
            className="rounded-full w-14 h-14 object-cover border-4 border-accent"
            style={{ boxShadow: "0 0 0 4px #E5DEFF" }}
          />
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-semibold text-base text-[#221F26]">Jessica Lee</span>
            <span className="text-xs text-gray-500">HR Thought Leader</span>
          </div>
          {/* "Featured on Rezume.dev" (instead of a logo, brand site theme) */}
          <span className="ml-0 sm:ml-6 mt-3 sm:mt-0 font-bold text-primary text-lg px-3 py-1 rounded bg-accent/60 border border-accent/20">
            Featured on Rezume.dev
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F1F0FB] rounded-xl py-6 flex flex-col items-center shadow">
          <UsersIcon className="w-6 h-6 mb-2 text-primary" />
          <div className="text-md text-muted-foreground mb-1 font-medium">Total Users</div>
          <div className="text-2xl md:text-3xl font-bold text-[#7E69AB]">212,400+</div>
        </div>
        <div className="bg-[#F1F0FB] rounded-xl py-6 flex flex-col items-center shadow">
          <ThumbsUpIcon className="w-6 h-6 mb-2 text-primary" />
          <div className="text-md text-muted-foreground mb-1 font-medium">Interview Rate</div>
          <div className="text-2xl md:text-3xl font-bold text-[#9B87F5]">64.7%</div>
        </div>
        <div className="bg-[#F1F0FB] rounded-xl py-6 flex flex-col items-center shadow">
          <StarIcon className="w-6 h-6 mb-2 text-[#FEC6A1] fill-[#FEC6A1]" />
          <div className="text-md text-muted-foreground mb-1 font-medium">Avg. User Review</div>
          <div className="text-2xl md:text-3xl font-bold text-[#403E43]">8.8/10</div>
        </div>
      </div>
    </div>
  </section>
);
