
import { WorldMap } from "./world-map";
import { motion } from "framer-motion";
import { GradientHeading } from "./gradient-heading";
import { TestimonialsSection } from "./testimonials-with-marquee";

const testimonials = [
  {
    author: {
      name: "Sarah Miller",
      handle: "@sarahm_tech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI-powered resume builder transformed my job search. Got callbacks from top companies within weeks!",
  },
  {
    author: {
      name: "Michael Chen",
      handle: "@mchen_dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Switched careers from finance to tech. The resume builder helped highlight my transferable skills perfectly.",
  },
  {
    author: {
      name: "Emily Rodriguez",
      handle: "@emilycareer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Got interviews at FAANG companies within weeks. The ATS optimization really works!",
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jwilson_pro",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
    },
    text: "From application to offer in 3 weeks. Best investment in my career journey.",
  },
];

export function WorldMapSection() {
  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GradientHeading size="lg" weight="bold" className="mb-4">
            Global Success Stories
          </GradientHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join over 100,000+ professionals worldwide who've transformed their careers using our AI-powered resume builder
          </p>
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
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
                start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
                end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
              },
            ]}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <TestimonialsSection
            title=""
            description=""
            testimonials={testimonials}
            className="bg-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
