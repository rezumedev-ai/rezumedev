
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { motion } from "framer-motion";
import { GradientHeading } from "@/components/ui/gradient-heading";

export const AnimatedTestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "The AI-powered resume builder transformed my job search. Got callbacks from top companies within weeks!",
      name: "Sarah Miller",
      designation: "Software Engineer",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote:
        "Switched careers from finance to tech. The resume builder helped highlight my transferable skills perfectly.",
      name: "Michael Chen",
      designation: "Product Manager",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote:
        "Got interviews at FAANG companies within weeks. The ATS optimization really works!",
      name: "Emily Rodriguez",
      designation: "UX Designer",
      src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote:
        "From application to offer in 3 weeks. Best investment in my career journey.",
      name: "James Wilson",
      designation: "Marketing Director",
      src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "HR Manager",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=149&h=149&fit=crop&crop=face"
    },
  ];

  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-8"
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </motion.div>
      </div>
    </section>
  );
};
