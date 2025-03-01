
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, Sparkles, Layout, ChevronRight, Bell, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const [showWelcome, setShowWelcome] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
          {showWelcome && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2
                }}
              >
                <motion.div
                  className="inline-block mb-6"
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1, 1.2, 1] 
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                >
                  <Sparkles className="w-16 h-16 text-primary" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60">
                  Welcome to Your Dashboard
                </h1>
                <p className="text-gray-600 text-xl">
                  Let's craft your professional story
                </p>
              </motion.div>
            </motion.div>
          )}

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
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Welcome back, {" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60 animate-gradient">
                    {profile?.full_name?.split(' ')[0] || 'there'}!
                  </span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl" 
                  style={{ animationDelay: '100ms' }}>
                  Create and manage your professional resumes with our AI-powered platform. 
                  Stand out from the crowd with beautifully crafted resumes.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex gap-2 w-full md:w-auto"
              variants={item}
            >
              <Button 
                variant="outline" 
                size="icon"
                className="relative group"
                onClick={() => toast({
                  title: "Notifications",
                  description: "You have no new notifications."
                })}
              >
                <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                className="group"
                onClick={() => navigate("/search")}
              >
                <Search className="h-5 w-5 group-hover:text-primary transition-colors" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={item} className="col-span-2">
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
              
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Resume Analytics</h3>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>ATS Compatibility</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Keyword Optimization</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Quality</span>
                        <span className="font-medium">93%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "93%" }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>
                  </div>
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
