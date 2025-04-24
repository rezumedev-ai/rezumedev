
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PricingFeature } from "./PricingFeature";

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  popular: boolean;
  color: string;
  badgeColor: string;
  delay: number;
}

export const PricingTier = ({
  name,
  price,
  period,
  description,
  features,
  cta,
  link,
  popular,
  color,
  badgeColor,
  delay
}: PricingTierProps) => {
  return (
    <motion.div
      className={`relative p-8 pt-10 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${popular ? 'border-primary md:scale-105 z-10' : 'border-gray-200'} overflow-hidden`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${color} opacity-80 rounded-full`}
        animate={{ 
          rotate: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="mb-4 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay }}
      >
        <span className={`inline-block ${badgeColor} px-3 py-1 text-xs font-medium rounded-full mb-2`}>
          {name} Plan
        </span>
        <h3 className="text-xl font-semibold text-secondary">{name}</h3>
      </motion.div>
      
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      >
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-primary">{price}</span>
          <span className="ml-2 text-muted-foreground">/{period}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </motion.div>
      
      <motion.div 
        className="space-y-4 mb-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay + 0.2
            }
          }
        }}
      >
        {features.map((feature) => (
          <PricingFeature key={feature} text={feature} color={color} />
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.4 }}
      >
        <Button 
          asChild 
          className={`w-full group ${popular ? 'bg-primary hover:bg-primary-hover' : ''}`}
          variant={popular ? "default" : "outline"}
        >
          <Link to={link}>
            {cta}
            <motion.span 
              className="ml-2 transition-transform"
              animate={{ x: [0, 4, 0] }} 
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse", 
                repeatDelay: 1 
              }}
            >
              →
            </motion.span>
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
