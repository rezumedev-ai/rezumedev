
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
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeSection, setActiveSection, isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
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

  const sidebarClasses = cn(
    "fixed top-0 h-full w-64 bg-white border-r border-gray-200 p-6 transition-all duration-300 ease-in-out z-40",
    isMobile ? (isOpen ? "left-0" : "-left-64") : "left-0"
  );

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div className={sidebarClasses}>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="h-6 w-6" />
          </Button>
        )}

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
                onClick={() => {
                  setActiveSection(id);
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
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
    </>
  );
}
