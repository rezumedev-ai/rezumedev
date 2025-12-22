
import { WorldMap } from "@/components/ui/world-map";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { motion } from "framer-motion";

export const AnimatedTestimonialsSection = () => {
  const testimonials = [
    {
      author: {
        name: "Sarah Jenkins",
        handle: "Senior Product Manager",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      },
      text: "The AI bullet point enhancer helped me articulate my impact. Landed a Senior PM role at a Fintech unicorn in 2 weeks.",
    },
    {
      author: {
        name: "David Chen",
        handle: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      },
      text: "I struggled with ATS rejection for months. RezumeDev's keyword analysis fixed my parsing issues instantly. 3 FAANG interviews later, I'm hired.",
    },
    {
      author: {
        name: "Elena Rossi",
        handle: "Marketing Director",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
      },
      text: "The 'Executive Clean' template is exactly what I needed. It looks polished and professional without being memorable for the wrong reasons.",
    },
    {
      author: {
        name: "Michael O'Connor",
        handle: "Investment Banker",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
      },
      text: "Automated formatting saved me hours. The PDF export is crisp and perfectly aligned. Highly recommended for finance professionals.",
    },
    {
      author: {
        name: "Priya Patel",
        handle: "Data Scientist",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      text: "The role-specific suggestions were spot on. It helped me highlight my Python and SQL skills in a way that recruiters actually noticed.",
    },
    {
      author: {
        name: "James Wilson",
        handle: "UX Designer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      text: "Finally, a resume builder that understands design hierarchy. The preview matches the download perfectly. A game changer for creatives.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GradientHeading size="lg" weight="bold" className="mb-6">
            Global Success Stories
          </GradientHeading>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals worldwide who secured their dream roles using our platform.
          </p>
        </motion.div>

        <div className="relative w-full max-w-7xl mx-auto">
          {/* World Map Background - Positioned absolutely to sit behind content or be part of the flow */}
          <div className="hidden md:block w-full h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
            <WorldMap
              dots={[
                {
                  start: { lat: 40.7128, lng: -74.006 }, // New York
                  end: { lat: 51.5074, lng: -0.1278 }, // London
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 }, // London
                  end: { lat: 48.8566, lng: 2.3522 }, // Paris
                },
                {
                  start: { lat: 48.8566, lng: 2.3522 }, // Paris
                  end: { lat: 52.52, lng: 13.405 }, // Berlin
                },
                {
                  start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                  end: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
                },
                {
                  start: { lat: 1.3521, lng: 103.8198 }, // Singapore
                  end: { lat: -33.8688, lng: 151.2093 }, // Sydney
                },
                {
                  start: { lat: 37.7749, lng: -122.4194 }, // SF
                  end: { lat: 40.7128, lng: -74.006 }, // NY
                },
              ]}
              lineColor="#000000"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10"
          >
            <TestimonialsSection
              title=""
              description=""
              testimonials={testimonials}
              className="py-8 bg-transparent"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
