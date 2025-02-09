
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ProgressSteps } from "@/components/dashboard/ProgressSteps";
import { DocumentsSection } from "@/components/dashboard/DocumentsSection";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("documents");

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
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
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
  );
}
