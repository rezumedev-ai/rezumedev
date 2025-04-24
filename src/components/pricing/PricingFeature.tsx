
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PricingFeatureProps {
  text: string;
  color?: string;
  highlight?: boolean;
}

export const PricingFeature = ({ text, color = "from-gray-500/20 to-gray-600/20", highlight = false }: PricingFeatureProps) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="flex items-start gap-3 group"
      variants={itemVariants}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`rounded-full p-1 bg-gradient-to-br ${color} group-hover:scale-110 transition-transform ${highlight ? 'ring-2 ring-primary ring-offset-1' : ''}`}
        whileHover={{ scale: 1.2, rotate: 5 }}
      >
        <Check className={`h-4 w-4 ${highlight ? 'text-primary font-bold' : 'text-primary'}`} />
      </motion.div>
      <span className={`${highlight ? 'font-medium text-secondary' : 'text-muted-foreground'} group-hover:text-primary transition-colors`}>
        {text}
      </span>
    </motion.div>
  );
};
