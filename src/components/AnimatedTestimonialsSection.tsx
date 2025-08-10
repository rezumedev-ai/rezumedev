
import { motion } from "framer-motion";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Testimonials } from "@/components/ui/testimonials";

export const AnimatedTestimonialsSection = () => {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      text: "The AI-powered resume builder transformed my job search. Got callbacks from top companies within weeks of updating my resume!",
      name: "Sarah Miller",
      username: "@sarahm_tech",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Switched careers from finance to tech. The resume builder helped highlight my transferable skills perfectly. I landed interviews at 3 tech startups!",
      name: "Michael Chen",
      username: "@mchen_dev",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      text: "Got interviews at FAANG companies within weeks. The ATS optimization feature really helped my resume get past the screening algorithms.",
      name: "Emily Rodriguez",
      username: "@emilycareer",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      text: "From application to offer in 3 weeks. The resume templates were professional and tailored to my industry. Best investment in my career journey.",
      name: "James Wilson",
      username: "@jwilson_pro",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=149&h=149&fit=crop&crop=face",
      text: "As a hiring manager, I can tell when candidates use Resume.dev. Their resumes stand out with clear organization and impactful content.",
      name: "Lisa Thompson",
      username: "@lisathompson",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "The modern templates and real-time preview helped me create a stand-out UX portfolio. The smart suggestions for achievements were invaluable.",
      name: "Lisa Chang",
      username: "@lisac_design",
      social: "https://twitter.com/"
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Impressed by how the AI customizes content for different job applications. Makes targeting specific positions so much easier with minimal effort.",
      name: "David Kumar",
      username: "@davidk_work",
      social: "https://twitter.com/"
    },
    {
      image: "https://i.imgur.com/kaDy9hV.jpeg",
      text: "The tailored suggestions for each job application are brilliant. Resume.dev helped me highlight the exact skills needed for each position I applied for.",
      name: "Emma Brown",
      username: "@emmabrown",
      social: "https://twitter.com/"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Testimonials 
            testimonials={testimonials} 
            title="Trusted by job seekers worldwide"
            description="We're a small team helping job seekers craft clear, ATS-friendly resumes that get noticed."
          />
        </motion.div>
      </div>
    </section>
  );
};
