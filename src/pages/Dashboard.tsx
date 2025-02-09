
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  PieChart,
  Lightbulb,
  Settings,
  HelpCircle,
  Plus,
  Download,
  Eye
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("resumes");

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

  const { data: coverLetters } = useQuery({
    queryKey: ["coverLetters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      return data;
    },
  });

  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || 'User'}! 👋
            </h1>
            <Button variant="outline" onClick={() => {}}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <nav className="md:col-span-3 space-y-1">
            {[
              { id: 'resumes', icon: FileText, label: 'Resumes' },
              { id: 'coverLetters', icon: FileText, label: 'Cover Letters' },
              { id: 'jobs', icon: Briefcase, label: 'Job Tracker' },
              { id: 'analytics', icon: PieChart, label: 'Analytics' },
              { id: 'suggestions', icon: Lightbulb, label: 'AI Suggestions' },
              { id: 'settings', icon: Settings, label: 'Settings' },
              { id: 'help', icon: HelpCircle, label: 'Help & Support' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  activeSection === id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <main className="md:col-span-9 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Resumes</p>
                    <p className="text-gray-600">{resumes?.length || 0} created</p>
                  </div>
                  <Button onClick={() => handleCreateNew('resume')} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Cover Letters</p>
                    <p className="text-gray-600">{coverLetters?.length || 0} created</p>
                  </div>
                  <Button onClick={() => handleCreateNew('cover letter')} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">Job Applications</p>
                    <p className="text-gray-600">{jobs?.length || 0} tracked</p>
                  </div>
                  <Button onClick={() => handleCreateNew('job')} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </Card>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Resume Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-2xl font-bold">
                        {resumes?.reduce((sum, resume) => sum + (resume.views || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Views</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-2xl font-bold">
                        {resumes?.reduce((sum, resume) => sum + (resume.downloads || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Downloads</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Job Applications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {jobs?.filter(job => job.status === 'saved').length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Saved Jobs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {jobs?.filter(job => job.status === 'applied').length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Applied</p>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
