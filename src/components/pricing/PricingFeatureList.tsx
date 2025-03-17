
import { motion } from "framer-motion";
import { PricingFeature } from "./PricingFeature";

interface PricingFeatureListProps {
  features: string[];
  highlightAll?: boolean;
  delay?: number;
}

export function PricingFeatureList({ features, highlightAll = false, delay = 0 }: PricingFeatureListProps) {
  return (
    <motion.ul 
      className="space-y-4 mb-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay
          }
        }
      }}
    >
      {features.map((feature, index) => (
        <PricingFeature 
          key={index}
          text={feature} 
          highlight={highlightAll} 
        />
      ))}
    </motion.ul>
  );
}
