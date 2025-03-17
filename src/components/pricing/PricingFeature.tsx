
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PricingFeatureProps {
  text: string;
  highlight?: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

export function PricingFeature({ text, highlight = false }: PricingFeatureProps) {
  return (
    <motion.li 
      className={`flex items-center gap-2 group ${highlight ? 'font-medium' : ''}`}
      variants={itemVariants}
    >
      <div className={`rounded-full p-1 group-hover:scale-110 transition-transform ${
        highlight ? 'bg-primary/20' : 'bg-primary/10'
      }`}>
        <Check className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-primary/80'}`} />
      </div>
      <span className={`${highlight ? 'text-secondary' : 'text-muted-foreground'} group-hover:text-primary transition-colors`}>
        {text}
      </span>
    </motion.li>
  );
}
