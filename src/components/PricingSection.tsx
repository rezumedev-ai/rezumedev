
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PricingTier } from "./pricing/PricingTier";
import { PricingHeader } from "./pricing/PricingHeader";
import { pricingTiers } from "./pricing/pricing-config";

const PricingSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white sm:py-32">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/50 to-transparent"></div>
      <motion.div 
        className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      <div className="container relative z-10">
        <PricingHeader />
        
        <motion.div 
          className="grid gap-8 md:grid-cols-4 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pricingTiers.map((tier) => (
            <PricingTier key={tier.name} {...tier} />
          ))}
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/80 backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-secondary">
                All plans include a 14-day money-back guarantee
              </p>
            </div>
          </motion.div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            <Link 
              to="/pricing"
              className="text-primary hover:underline flex items-center justify-center gap-1"
            >
              <span>View all plan details and features</span>
              <motion.span 
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                →
              </motion.span>
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
