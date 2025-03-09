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
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        when: "beforeChildren",
        staggerChildren: 0.05
      } 
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarClasses = cn(
    "fixed top-0 h-full w-64 bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-800/50 p-6 z-50",
    isMobile ? "left-0" : "left-0"
  );

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div 
            className={sidebarClasses}
            initial={isMobile ? "closed" : "open"}
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:text-gray-300 dark:hover:text-red-400 transition-colors"
                >
                  <X className="h-6 w-6" />
                </Button>
              </motion.div>
            )}

            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/10 dark:border-primary/20"
                variants={itemVariants}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-medium shadow-lg">
                    {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 2
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <motion.h3 
                    className="font-medium text-gray-900 dark:text-white truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {profile?.full_name || 'User'}
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-gray-500 dark:text-gray-400 truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {user?.email}
                  </motion.p>
                </div>
              </motion.div>

              <motion.div className="flex items-center justify-between px-4" variants={itemVariants}>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Appearance
                </div>
                <ThemeToggle size="sm" />
              </motion.div>

              <motion.div 
                className="pt-4 space-y-1"
                variants={itemVariants}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Main Menu
                </div>
                {menuItems.map(({ id, icon: Icon, label, path }) => (
                  <motion.button
                    key={id}
                    onClick={() => {
                      navigate(path);
                      if (isMobile && onClose) {
                        onClose();
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
                      location.pathname === path
                        ? "bg-primary text-white shadow-md hover:shadow-lg"
                        : "text-gray-600 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-primary/10"
                    )}
                    onMouseEnter={() => setHoveredItem(id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0 mr-3",
                        location.pathname === path && hoveredItem === id && "animate-pulse"
                      )} />
                      <span className="truncate">{label}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>

            <motion.div 
              className="absolute bottom-6 left-0 w-full px-6"
              variants={itemVariants}
            >
              <motion.button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign out</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
