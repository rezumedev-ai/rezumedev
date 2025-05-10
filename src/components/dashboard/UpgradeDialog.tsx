
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star } from "lucide-react";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeDialog({ isOpen, onClose }: UpgradeDialogProps) {
  const navigate = useNavigate();

  const handleViewPricing = () => {
    navigate("/pricing");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
        {/* Gradient header stripe */}
        <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
        
        <div className="relative">
          {/* Background decorative elements */}
          <motion.div 
            className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>

        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex justify-center mb-4">
            <motion.div 
              className="bg-primary/10 p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
          </div>
          <DialogTitle className="text-xl text-center">Unlock Premium Features</DialogTitle>
          <DialogDescription className="text-center">
            Take your resume to the next level with our premium plans
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Premium features */}
          <div className="grid gap-3">
            <PremiumFeature 
              icon={<Star className="h-4 w-4 text-amber-500" />}
              title="Professional Templates" 
              description="Access our complete library of premium templates"
            />
            <PremiumFeature 
              icon={<Sparkles className="h-4 w-4 text-blue-500" />}
              title="AI-Enhanced Resume Reviews" 
              description="Get intelligent feedback on your resume"
            />
            <PremiumFeature 
              icon={<ArrowRight className="h-4 w-4 text-green-500" />}
              title="Unlimited Resumes" 
              description="Create as many versions as you need"
            />
          </div>

          {/* User testimonial */}
          <div className="bg-accent/60 rounded-lg p-3 mt-2">
            <p className="text-xs italic text-muted-foreground">
              "The premium templates helped me land interviews at my dream companies. Best investment in my career!" 
            </p>
            <p className="text-xs font-medium mt-1 text-right">— Michael T., Software Engineer</p>
          </div>
        </div>

        <DialogFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:w-auto w-full"
          >
            Continue to Dashboard
          </Button>
          <Button 
            onClick={handleViewPricing}
            className="sm:w-auto w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 transition-all duration-300"
          >
            View Premium Plans
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PremiumFeature({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <motion.div 
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-primary/10 rounded-full p-1.5 mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
