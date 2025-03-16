
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  CreditCard,
  Badge,
  Crown,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString()
        })
        .eq("id", user?.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Subscription canceled",
        description: "Your subscription has been canceled successfully. You'll still have access until the end of your current billing period.",
      });
      setShowCancelDialog(false);
    },
    onError: (error) => {
      console.error("Error canceling subscription:", error);
      toast({
        variant: "destructive",
        title: "Error canceling subscription",
        description: "There was a problem canceling your subscription. Please try again or contact support."
      });
    }
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
    { id: 'pricing', icon: CreditCard, label: 'Pricing', path: '/pricing' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', path: '/help' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleCancelSubscription = () => {
    cancelSubscription.mutate();
  };

  const sidebarClasses = cn(
    "fixed top-0 h-full w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-6 z-50",
    isMobile ? "left-0" : "left-0"
  );

  // Helper function to format subscription plan name
  const formatPlanName = (plan: string | null) => {
    if (!plan) return 'Free';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  // Get subscription badge and styling
  const getSubscriptionBadge = () => {
    if (!profile?.subscription_plan) return null;
    
    const isActive = profile.subscription_status === 'active';
    const isCanceled = profile.subscription_status === 'canceled';
    const isPastDue = profile.subscription_status === 'past_due';
    
    let badgeIcon = ShieldCheck;
    let gradientColors = "from-blue-500 to-purple-600";
    let statusText = "Active";
    let hoverEffect = "hover:shadow-md hover:shadow-purple-200/50";
    let statusDot = "bg-green-500";
    
    if (isCanceled) {
      gradientColors = "from-amber-400 to-orange-500";
      statusText = "Canceled";
      hoverEffect = "hover:shadow-md hover:shadow-orange-200/50";
      statusDot = "bg-orange-500";
    } else if (isPastDue) {
      gradientColors = "from-red-400 to-pink-500";
      statusText = "Past Due";
      hoverEffect = "hover:shadow-md hover:shadow-red-200/50";
      statusDot = "bg-red-500";
    }
    
    return (
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className={`mt-4 mx-2 p-3 rounded-lg bg-gradient-to-r ${gradientColors} ${hoverEffect} transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-md backdrop-blur-sm">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <div className="font-medium text-sm">{formatPlanName(profile.subscription_plan)} Plan</div>
            <div className="flex items-center gap-1.5 text-xs opacity-90">
              <div className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse`}></div>
              <span>{statusText}</span>
            </div>
          </div>
        </div>
        
        {isActive && (
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 bg-white/20 text-white hover:bg-white/30 text-xs"
              >
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your subscription? You'll still have access to premium features until the end of your current billing period.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep My Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, Cancel Subscription
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
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
                  className="absolute top-4 right-4 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </Button>
              </motion.div>
            )}

            <div className="space-y-6">
              <motion.div 
                className="flex items-center space-x-3 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/10"
                variants={itemVariants}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-medium shadow-lg">
                    {profile?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"
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
                    className="font-medium text-gray-900 truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {profile?.full_name || 'User'}
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-gray-500 truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {user?.email}
                  </motion.p>
                </div>
              </motion.div>

              {getSubscriptionBadge()}

              <motion.div 
                className="pt-4 space-y-1"
                variants={itemVariants}
              >
                <div className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">
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
                        : "text-gray-600 hover:bg-primary/5"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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
