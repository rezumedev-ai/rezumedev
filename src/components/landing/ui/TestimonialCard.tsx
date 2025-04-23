
import React from "react";
import { StarIcon } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    title: string;
    imageSrc: string;
  };
  badgeText?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  badgeText 
}) => {
  return (
    <div className="rounded-2xl bg-white shadow-xl border border-[#F1F0FB] p-8 md:p-12 text-center mb-10 relative">
      {/* Stars */}
      <div className="flex justify-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="w-5 h-5 text-[#9B87F5] fill-[#9B87F5]" />
        ))}
      </div>
      <blockquote className="font-semibold text-xl md:text-3xl text-[#1A1F2C] leading-relaxed mb-8">
        {quote}
      </blockquote>
      {/* Reviewer Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <img
          src={author.imageSrc}
          alt={`${author.name} - ${author.title}`}
          className="rounded-full w-14 h-14 object-cover border-4 border-accent"
          style={{ boxShadow: "0 0 0 4px #E5DEFF" }}
        />
        <div className="flex flex-col items-center sm:items-start">
          <span className="font-semibold text-base text-[#221F26]">{author.name}</span>
          <span className="text-xs text-gray-500">{author.title}</span>
        </div>
        {badgeText && (
          <span className="ml-0 sm:ml-6 mt-3 sm:mt-0 font-bold text-primary text-lg px-3 py-1 rounded bg-accent/60 border border-accent/20">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
