
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPricing: () => void;
}

export function UpgradeDialog({ isOpen, onClose, onViewPricing }: UpgradeDialogProps) {
  const features = [
    "Unlimited resume creations",
    "Premium templates",
    "AI-powered suggestions",
    "Download in multiple formats",
    "Priority support",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {/* Decorative backgrounds */}
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-background"></div>
        <div className="absolute -z-10 -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        
        <DialogHeader>
          <motion.div 
            className="flex justify-center mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
          <DialogTitle className="text-xl text-center">Unlock Premium Features</DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="font-medium">Welcome to Rezume.dev!</span> You've created your free account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                }
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 group"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <div className="rounded-full p-1 bg-primary/10 group-hover:scale-110 transition-transform">
                  <Star className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
          
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Upgrade today and take your resume to the next level!
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-auto w-full"
          >
            Continue to Dashboard
          </Button>
          <Button 
            onClick={onViewPricing}
            className="sm:w-auto w-full bg-gradient-to-r from-primary to-primary/80"
          >
            View Premium Plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
