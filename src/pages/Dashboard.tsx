
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ProgressSteps } from "@/components/dashboard/ProgressSteps";
import { DocumentsSection } from "@/components/dashboard/DocumentsSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("documents");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

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

  const progressSteps = [
    {
      title: "Explore your personalized job recommendations",
      description: "Specify your target role, compensation, location, and other preferences.",
      completed: false,
    },
    {
      title: "Save at least 5 jobs to your shortlist",
      description: "Browse through job listings and save the ones that interest you.",
      completed: false,
    },
    {
      title: "Complete your career growth assessment",
      description: "15 min • 11 questions",
      completed: false,
    },
  ];

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
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'mt-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                Hi, {profile?.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-gray-600 mt-2">
                Complete these steps to land your next role
              </p>
            </div>

            <ProgressSteps steps={progressSteps} />
            <DocumentsSection resumes={resumes || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
