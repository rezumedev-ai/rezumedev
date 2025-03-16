
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, Sparkles, Layout, ChevronRight, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResumeData {
  id: string;
  title: string;
  updated_at: string;
  completion_status: string;
  current_step: number;
  professional_summary: Json;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: resumes, isLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resumes")
        .select("id, title, updated_at, completion_status, current_step, professional_summary")
        .eq("user_id", user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((resume: ResumeData) => ({
        ...resume,
        professional_summary: typeof resume.professional_summary === 'object' 
          ? resume.professional_summary as { title: string }
          : { title: '' }
      }));
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      // For manually added subscriptions, just update the status in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString()
        })
        .eq("id", user?.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Subscription canceled",
        description: "Your subscription has been canceled successfully. You'll still have access until the end of your current billing period.",
      });
      setShowCancelDialog(false);
    },
    onError: (error) => {
      console.error("Error canceling subscription:", error);
      toast({
        variant: "destructive",
        title: "Error canceling subscription",
        description: "There was a problem canceling your subscription. Please try again or contact support."
      });
    }
  });

  const handleCreateNew = () => {
    navigate("/new-resume");
  };

  const handleCancelSubscription = () => {
    cancelSubscription.mutate();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const handleQuickTips = () => {
    toast({
      title: "Resume Pro Tips",
      description: "Keep your resume concise, customize for each job, and focus on achievements instead of duties.",
    });
  };

  // Helper function to get subscription status badge color
  const getSubscriptionStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'past_due':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper function to format subscription plan name
  const formatPlanName = (plan: string | null) => {
    if (!plan) return 'Free';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20">
      {isMobile && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hover:bg-primary/5"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Rezume.dev
            </span>
          </div>
        </motion.div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'pt-20 px-4' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-12">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="space-y-4 w-full" variants={item}>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Layout className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span>Resumes</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Welcome back, {" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60 animate-gradient">
                      {profile?.full_name?.split(' ')[0] || 'there'}!
                    </span>
                  </h1>
                  
                  {profile?.subscription_status && (
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubscriptionStatusColor(profile.subscription_status)}`}>
                        {formatPlanName(profile.subscription_plan)} Plan - {profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1)}
                      </div>
                      
                      {profile.subscription_status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setShowCancelDialog(true)}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-base md:text-lg text-gray-600 max-w-2xl" 
                  style={{ animationDelay: '100ms' }}>
                  Create and manage your professional resumes with our AI-powered platform. 
                  Stand out from the crowd with beautifully crafted resumes.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6"
          >
            <motion.div variants={item}>
              {isLoading ? (
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="h-96 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Loading your resumes...</p>
                  </div>
                </Card>
              ) : (
                <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
              )}
            </motion.div>
            
            <motion.div variants={item} className="space-y-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Quick Tips</h3>
                    <Button variant="ghost" size="sm" onClick={handleQuickTips}>
                      <Star className="h-4 w-4 text-amber-400 mr-1" />
                      More Tips
                    </Button>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Tailor your resume for each job application</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Quantify achievements with numbers when possible</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Use keywords from the job description</p>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Cancel Subscription
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You'll still have access to premium features until the end of your current billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep My Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
