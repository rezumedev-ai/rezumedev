
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
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard as CreditCardIcon,
  Sparkles,
  ArrowUpCircle,
  Gift
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

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
  const [showManageDialog, setShowManageDialog] = useState(false);

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
      setShowManageDialog(false);
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

  const formatPlanName = (plan: string | null) => {
    if (!plan) return 'Free';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  const formatSubscriptionDate = (date: string | null) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMMM d, yyyy');
  };

  const getExpiryDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 1);
    return format(futureDate, 'MMMM d, yyyy');
  };

  const getSubscriptionBadge = () => {
    // Fix: Use the actual component instead of trying to use it as a JSX element
    let BadgeIcon = profile?.subscription_plan ? Crown : Gift;
    let gradientColors = "from-blue-500 to-purple-600";
    let planText = "Free Plan";
    let statusText = "Active";
    let hoverEffect = "hover:shadow-md hover:shadow-purple-200/50";
    let statusDot = "bg-green-500";
    let showStatusDot = true;
    
    if (profile?.subscription_plan) {
      planText = `${formatPlanName(profile.subscription_plan)} Plan`;
      
      if (profile.subscription_status === 'active') {
        statusText = "Active";
        statusDot = "bg-green-500";
      } else if (profile.subscription_status === 'canceled') {
        gradientColors = "from-amber-400 to-orange-500";
        statusText = "Canceled";
        hoverEffect = "hover:shadow-md hover:shadow-orange-200/50";
        statusDot = "bg-orange-500";
      } else if (profile.subscription_status === 'past_due') {
        gradientColors = "from-red-400 to-pink-500";
        statusText = "Past Due";
        hoverEffect = "hover:shadow-md hover:shadow-red-200/50";
        statusDot = "bg-red-500";
      }
    } else {
      gradientColors = "from-gray-400 to-gray-600";
      hoverEffect = "hover:shadow-md hover:shadow-gray-200/50";
      showStatusDot = false;
    }
    
    return (
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -2 }}
        className={`mt-4 mx-2 p-3 rounded-lg bg-gradient-to-r ${gradientColors} ${hoverEffect} transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-md backdrop-blur-sm">
            <BadgeIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <div className="font-medium text-sm">{planText}</div>
            {showStatusDot && (
              <div className="flex items-center gap-1.5 text-xs opacity-90">
                <div className={`w-1.5 h-1.5 rounded-full ${statusDot} animate-pulse`}></div>
                <span>{statusText}</span>
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 bg-white/20 text-white hover:bg-white/30 text-xs"
            >
              Manage Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Subscription Details
              </DialogTitle>
              <DialogDescription>
                {profile?.subscription_plan 
                  ? `Manage your ${formatPlanName(profile.subscription_plan)} subscription`
                  : "Upgrade to access premium features"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {profile?.subscription_plan ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-primary/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-primary flex items-center gap-1.5">
                      <Crown className="h-4 w-4" />
                      <span>{formatPlanName(profile.subscription_plan)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      {profile.subscription_status === 'active' && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-green-600 font-medium">Active</span>
                        </>
                      )}
                      {profile.subscription_status === 'canceled' && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                          <span className="text-orange-600 font-medium">Canceled</span>
                        </>
                      )}
                      {profile.subscription_status === 'past_due' && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-red-600 font-medium">Past Due</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Started on</span>
                      </div>
                      <span className="font-medium">{formatSubscriptionDate(profile.updated_at)}</span>
                    </div>
                    
                    {profile.subscription_status === 'active' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Next billing date</span>
                        </div>
                        <span className="font-medium">{getExpiryDate()}</span>
                      </div>
                    )}
                    
                    {profile.subscription_status === 'canceled' && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Access until</span>
                        </div>
                        <span className="font-medium">{getExpiryDate()}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCardIcon className="h-4 w-4 text-gray-500" />
                        <span>Payment method</span>
                      </div>
                      <span className="font-medium">•••• 4242</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                      <Gift className="h-4 w-4" />
                      <span>Free Plan</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Limited Features
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Upgrade to a premium plan to unlock all features and create unlimited resumes.
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">
                  {profile?.subscription_plan ? "Your Benefits:" : "Premium Benefits:"}
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.subscription_plan ? "text-green-500" : "text-gray-400"} mt-0.5 flex-shrink-0`} />
                    <span className={profile?.subscription_plan ? "" : "text-gray-500"}>Unlimited resume creations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.subscription_plan ? "text-green-500" : "text-gray-400"} mt-0.5 flex-shrink-0`} />
                    <span className={profile?.subscription_plan ? "" : "text-gray-500"}>Access to all premium templates</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={`h-4 w-4 ${profile?.subscription_plan ? "text-green-500" : "text-gray-400"} mt-0.5 flex-shrink-0`} />
                    <span className={profile?.subscription_plan ? "" : "text-gray-500"}>AI-powered resume enhancement</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col gap-3 sm:flex-row">
              {profile?.subscription_plan ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => navigate("/pricing")}
                  >
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    {profile.subscription_status === 'active' ? "Upgrade Plan" : "View Plans"}
                  </Button>
                  
                  {profile.subscription_status === 'active' && (
                    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
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
                  
                  {profile.subscription_status === 'canceled' && (
                    <Button 
                      className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover"
                      onClick={() => navigate("/pricing")}
                    >
                      Reactivate Subscription
                    </Button>
                  )}
                </>
              ) : (
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-hover"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
