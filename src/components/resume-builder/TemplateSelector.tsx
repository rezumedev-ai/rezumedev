import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { resumeTemplates } from "./templates";
import { TemplatePreview } from "./TemplatePreview";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface TemplateSelectorProps {
  onTemplateSelect?: (templateId: string) => void;
}

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps = {}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(resumeTemplates[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile to check subscription status
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_plan, subscription_status")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    },
    enabled: !!user
  });

  const hasActiveSubscription = profile && 
    profile.subscription_plan && 
    profile.subscription_status === 'active';

  const handleContinue = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Select a Template",
        description: "Please select a template to continue",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // Check if user has an active subscription
    if (!hasActiveSubscription) {
      setShowSubscriptionDialog(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Creating resume with template:", selectedTemplate);

      const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .insert([
          {
            user_id: user.id,
            title: 'Untitled Resume',
            template_id: selectedTemplate,
            content: {},
            current_step: 1
          }
        ])
        .select()
        .single();

      if (resumeError) {
        console.error('Error creating resume:', resumeError);
        throw resumeError;
      }

      if (!resume || !resume.id) {
        throw new Error("No resume ID returned from database");
      }

      console.log("Resume created successfully:", resume.id);
      navigate(`/resume-builder/${resume.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPricing = () => {
    setShowSubscriptionDialog(false);
    navigate("/pricing");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          Choose Your Resume Template
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select a professional template that best showcases your skills and experience
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resumeTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <TemplatePreview
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-12 flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          onClick={handleContinue} 
          className="min-w-[200px] py-6 text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="animate-pulse">Creating...</span>
            </motion.div>
          ) : (
            <motion.div className="flex items-center space-x-2">
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Subscription Required Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Subscription Required
            </DialogTitle>
            <DialogDescription>
              Creating resumes requires an active subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-700 mb-4">
              Upgrade to a paid plan to unlock unlimited resume creation, premium templates, and AI-powered resume optimization.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSubscriptionDialog(false)}
              className="sm:w-auto w-full"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={navigateToPricing}
              className="sm:w-auto w-full bg-gradient-to-r from-primary to-primary-hover"
            >
              View Pricing Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
