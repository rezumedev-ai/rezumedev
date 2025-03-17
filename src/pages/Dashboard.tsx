
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickTipsCard } from "@/components/dashboard/QuickTipsCard";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";

interface ResumeData {
  id: string;
  title: string;
  updated_at: string;
  completion_status: string;
  current_step: number;
  professional_summary: {
    title: string;
  };
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

  const handleCreateNew = () => {
    navigate("/new-resume");
  };

  const handleQuickTips = () => {
    toast({
      title: "Resume Pro Tips",
      description: "Keep your resume concise, customize for each job, and focus on achievements instead of duties.",
    });
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
            <DashboardHeader 
              userName={profile?.full_name?.split(' ')[0] || 'there'} 
            />
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6"
          >
            {isLoading ? (
              <DashboardLoading />
            ) : (
              <motion.div variants={container.show}>
                <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
              </motion.div>
            )}
            
            <QuickTipsCard onShowTips={handleQuickTips} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
