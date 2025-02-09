
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  PieChart,
  Lightbulb,
  DollarSign,
  Headphones,
  Settings,
  HelpCircle,
  Plus,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
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

  const handleCreateNew = (type: string) => {
    toast({
      title: `Creating new ${type}`,
      description: "This feature will be implemented soon!",
    });
  };

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
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <h3 className="font-medium">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-gray-500">Set your target role</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'documents', icon: FileText, label: 'Documents' },
              { id: 'jobs', icon: Briefcase, label: 'Jobs' },
              { id: 'jobTracker', icon: PieChart, label: 'Job Tracker' },
              { id: 'interviewPrep', icon: Lightbulb, label: 'Interview Prep' },
              { id: 'salaryAnalyzer', icon: DollarSign, label: 'Salary Analyzer' },
              { id: 'coaching', icon: Headphones, label: 'Coaching' },
              { id: 'settings', icon: Settings, label: 'Settings' },
              { id: 'help', icon: HelpCircle, label: 'Help & Support' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-left",
                  activeSection === id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <Button
          variant="ghost"
          className="absolute bottom-6 left-6 text-gray-600 hover:text-gray-900"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign out
        </Button>
      </div>

      {/* Main Content */}
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

          {/* Progress Steps */}
          <div className="space-y-4">
            {progressSteps.map((step, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-gray-900">Documents</h2>
              </div>
              <Button onClick={() => handleCreateNew('resume')}>
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumes?.map((resume) => (
                <Card key={resume.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">{resume.title || 'Untitled'}</h3>
                    <p className="text-sm text-gray-500">
                      Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        100% Score
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="p-6 border-dashed hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCreateNew('resume')}>
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <Plus className="w-8 h-8" />
                  <p className="font-medium">Create New Resume</p>
                  <p className="text-sm text-center">Create a tailored resume for each job application</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
