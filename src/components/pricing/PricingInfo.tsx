
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function PricingInfo() {
  return (
    <motion.div 
      className="max-w-2xl mx-auto text-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="inline-flex items-center p-4 rounded-xl bg-accent/80 backdrop-blur-sm mb-6">
        <div className="flex flex-col items-center p-3 rounded-lg">
          <h4 className="font-medium text-secondary">Satisfaction Guaranteed</h4>
          <p className="text-sm text-muted-foreground">14-day money-back guarantee</p>
        </div>
        <div className="h-10 w-px bg-muted mx-4"></div>
        <div className="flex flex-col items-center p-3 rounded-lg">
          <h4 className="font-medium text-secondary">Secure Payments</h4>
          <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Questions about our pricing? <Link to="/contact" className="text-primary hover:underline">Contact our team</Link>
      </p>
    </motion.div>
  );
}
