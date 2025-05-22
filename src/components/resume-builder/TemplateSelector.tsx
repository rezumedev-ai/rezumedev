
import { useState, useEffect } from "react";
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
import { ResumeProfile } from "@/types/profile";

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
  
  // Get the selected profile ID from localStorage
  const selectedProfileId = localStorage.getItem('selectedProfileId');

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

  // Fetch the selected resume profile
  const { data: resumeProfile } = useQuery({
    queryKey: ["resumeProfile", selectedProfileId],
    queryFn: async () => {
      if (!selectedProfileId || !user) return null;
      const { data, error } = await supabase
        .from("resume_profiles")
        .select("*")
        .eq("id", selectedProfileId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching resume profile:", error);
        return null;
      }
      return data as ResumeProfile;
    },
    enabled: !!selectedProfileId && !!user
  });

  // Get the count of existing resumes for free users
  const { data: resumeCount } = useQuery({
    queryKey: ["resumeCount", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("resumes")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching resume count:", error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!user
  });

  // Redirect to profile selection if no profile is selected
  useEffect(() => {
    if (user && !selectedProfileId) {
      navigate('/profiles');
    }
  }, [user, selectedProfileId, navigate]);

  const hasActiveSubscription = profile && 
    profile.subscription_plan && 
    (profile.subscription_status === 'active' || profile.subscription_status === 'canceled');

  // Update this logic to allow creating the first resume even without subscription
  const canCreateResume = hasActiveSubscription || (resumeCount !== undefined && resumeCount < 1);

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

    if (!resumeProfile) {
      toast({
        title: "Profile Required",
        description: "Please select a profile to continue",
        variant: "destructive"
      });
      navigate("/profiles");
      return;
    }

    // Check if user has an active subscription or this is their first resume
    if (!canCreateResume) {
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
            current_step: 1,
            personal_info: resumeProfile.personal_info
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

  const navigateToProfiles = () => {
    navigate("/profiles");
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
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            Choose Your Resume Template
          </h2>
          <p className="text-muted-foreground">
            Select a professional template for your resume
          </p>
        </div>
        
        {resumeProfile && (
          <Button
            variant="outline"
            onClick={navigateToProfiles}
            className="flex items-center gap-2"
          >
            Using {resumeProfile.name}
            <span className="text-xs opacity-70">(Change)</span>
          </Button>
        )}
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
              {resumeCount && resumeCount > 0 
                ? "You've reached the limit for free resumes. Subscribe to create more."
                : "Creating resumes requires an active subscription plan."}
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
