
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
    <div className="min-h-screen bg-gray-50">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'mt-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Hi, {profile?.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage your professional resumes
              </p>
            </div>

            <ResumeList resumes={resumes || []} onCreateNew={handleCreateNew} />
          </div>
        </div>
      </div>
    </div>
  );
}
