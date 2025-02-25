
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Sarah Miller",
      handle: "@sarahm_tech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI-powered resume builder transformed my job search. Got callbacks from top companies within weeks. The ATS optimization really works!",
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@mchen_dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Switched careers from finance to tech. The resume builder helped highlight my transferable skills perfectly. Landed my dream dev role!",
  },
  {
    author: {
      name: "Emily Rodriguez",
      handle: "@emilycareer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "The tailored suggestions for each job application are brilliant. It's like having a professional resume writer by your side.",
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jwilson_pro",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
    },
    text: "Best resume builder I've used. The AI understands industry standards and automatically formats everything perfectly.",
  },
  {
    author: {
      name: "Lisa Chang",
      handle: "@lisac_design",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "The modern templates and real-time preview helped me create a stand-out UX portfolio. Received multiple offers within a month!",
  },
  {
    author: {
      name: "David Kumar",
      handle: "@davidk_work",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Impressed by how the AI customizes content for different roles. Makes targeting specific positions so much easier.",
  }
];

export const Testimonials = () => {
  return (
    <TestimonialsSection
      title="Trusted by job seekers worldwide"
      description="Join thousands of professionals who've landed their dream jobs using our AI-powered resume builder"
      testimonials={testimonials}
    />
  );
};
