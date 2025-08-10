
import { motion } from "framer-motion";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Testimonials } from "@/components/ui/testimonials";

export const AnimatedTestimonialsSection = () => {
  const testimonials = [
    {
      image: "https://i.pravatar.cc/150?img=11",
      text: "My ATS score went from 54 to 92. The keyword suggestions and phrasing tips were spot on—had two interviews in a week.",
      name: "Aisha Khan",
      username: "Product Marketing Manager"
    },
    {
      image: "https://i.pravatar.cc/150?img=32",
      text: "The role-targeted template turned my generic resume into a focused one. Got callbacks from two fintechs.",
      name: "Daniel Chen",
      username: "Software Engineer"
    },
    {
      image: "https://i.pravatar.cc/150?img=5",
      text: "Loved the quantified bullet ideas—'reduced onboarding time by 37%' is the kind of line hiring managers remember.",
      name: "María López",
      username: "HR Generalist"
    },
    {
      image: "https://i.pravatar.cc/150?img=21",
      text: "Exported a clean PDF and a DOCX version in minutes. Landed an HRBP interview the same week.",
      name: "Oliver Smith",
      username: "Data Analyst"
    },
    {
      image: "https://i.pravatar.cc/150?img=47",
      text: "The bullet generator turned my duties into impact. Recruiters actually replied for the first time.",
      name: "Priya Nair",
      username: "UX Designer"
    },
    {
      image: "https://i.pravatar.cc/150?img=66",
      text: "Adding metrics was a game-changer—helped me negotiate a 22% raise with a senior AE offer.",
      name: "Jamal Williams",
      username: "Sales Lead"
    },
    {
      image: "https://i.pravatar.cc/150?img=15",
      text: "ATS scan flagged missing keywords (PMP, stakeholder comms). I fixed them and got two offers.",
      name: "Nina Petrova",
      username: "Project Manager"
    },
    {
      image: "https://i.pravatar.cc/150?img=28",
      text: "Keyword suggestions matched the job posts (Kubernetes, IaC, observability). My response rate doubled.",
      name: "Luca Moretti",
      username: "DevOps Engineer"
    }
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
            hideSocial
          />
        </motion.div>
      </div>
    </section>
  );
};
