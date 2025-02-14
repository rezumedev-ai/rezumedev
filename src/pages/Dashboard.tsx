
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeList } from "@/components/dashboard/ResumeList";
import { useNavigate } from "react-router-dom";

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
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
  });

  const handleCreateNew = () => {
    navigate("/resume-builder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-semibold text-primary">Rezume.dev</span>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'pt-20 px-4' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-8">
          <div className="animate-fade-up">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 break-words">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">{profile?.full_name?.split(' ')[0] || 'there'}!</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 animate-fade-up break-words" style={{ animationDelay: '100ms' }}>
              Create and manage your professional resumes with ease
            </p>
          </div>

          <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
        </div>
      </div>
    </div>
  );
}
