
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Sparkles, Layout, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

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

  const { data: resumes } = useQuery({
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/20">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex justify-between items-center">
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
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'pt-20 px-4' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-12">
          <div className="space-y-4 animate-fade-up">
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
              <p className="text-base md:text-lg text-gray-600 animate-fade-up max-w-2xl" 
                style={{ animationDelay: '100ms' }}>
                Create and manage your professional resumes with our AI-powered platform. 
                Stand out from the crowd with beautifully crafted resumes.
              </p>
            </div>
          </div>

          <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
        </div>
      </div>
    </div>
  );
}
