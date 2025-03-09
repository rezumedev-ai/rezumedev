import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, Sparkles, Layout, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        .eq("user_id", user?.id);

      if (error) throw error;

      return (data || []).map((resume: ResumeData) => ({
        ...resume,
        professional_summary: typeof resume.professional_summary === 'object' 
          ? resume.professional_summary as { title: string }
          : { title: '' }
      }));
    },
  });

  const handleCreateNew = () => {
    navigate("/resume-builder");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20 dark:from-gray-900 dark:via-purple-900/10 dark:to-blue-900/10">
      {isMobile && (
        <motion.div 
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex justify-between items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="hover:bg-primary/5 dark:hover:bg-primary/10 dark:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary dark:text-primary animate-pulse" />
            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 dark:from-primary dark:to-primary/80">
              Rezume.dev
            </span>
          </div>
          <ThemeToggle />
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
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Layout className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span>Resumes</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Welcome back, {" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60 dark:from-primary dark:via-purple-400 dark:to-blue-400 animate-gradient">
                    {profile?.full_name?.split(' ')[0] || 'there'}!
                  </span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl" 
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
                <Card className="p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/30">
                  <div className="h-96 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
                    <p className="text-muted-foreground dark:text-gray-400">Loading your resumes...</p>
                  </div>
                </Card>
              ) : (
                <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
              )}
            </motion.div>
            
            <motion.div variants={item} className="space-y-6">
              <Card className="p-6 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold dark:text-white">Quick Tips</h3>
                    <Button variant="ghost" size="sm" onClick={handleQuickTips} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      <Star className="h-4 w-4 text-amber-400 mr-1" />
                      More Tips
                    </Button>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Tailor your resume for each job application</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Quantify achievements with numbers when possible</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Use keywords from the job description</p>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
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
