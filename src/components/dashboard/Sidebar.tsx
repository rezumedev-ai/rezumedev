
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
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

  const sidebarClasses = cn(
    "fixed top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-6 transition-all duration-300 ease-in-out z-40 shadow-lg",
    isMobile ? (isOpen ? "left-0" : "-left-64") : "left-0"
  );

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
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

        <div className="space-y-6 animate-fade-up">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-primary/5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-medium">
              {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-gray-500 truncate max-w-[140px]">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map(({ id, icon: Icon, label, path }) => (
              <button
                key={id}
                onClick={() => {
                  navigate(path);
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  location.pathname === path
                    ? "bg-primary text-white shadow-md hover:shadow-lg"
                    : "text-gray-600 hover:bg-primary/5"
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
          className="absolute bottom-6 left-6 text-gray-600 hover:text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign out
        </Button>
      </div>
    </>
  );
}
