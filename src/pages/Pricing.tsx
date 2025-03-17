
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle, Sparkles, Star } from "lucide-react";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export type PlanType = "monthly" | "yearly" | "lifetime";

const Pricing = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });

  const hasActiveSubscription = profile?.subscription_status === 'active' && profile?.subscription_plan;
  const currentPlan = profile?.subscription_plan as PlanType | undefined;

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const renderHeader = () => {
    if (isAuthenticated) {
      if (isMobile) {
        return (
          <div className="md:hidden">
            <SimplifiedHeader />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        );
      } else {
        return (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        );
      }
    } else {
      return <Header />;
    }
  };

  const renderSubscriptionButton = (planType: PlanType) => {
    if (hasActiveSubscription && currentPlan === planType) {
      return (
        <Button variant="outline" className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800" disabled>
          <CheckCircle className="mr-2 h-4 w-4" />
          Current Plan
        </Button>
      );
    }

    return (
      <CheckoutButton
        planType={planType}
        className={`w-full hover:scale-105 transition-transform ${
          hasActiveSubscription ? "bg-blue-600 hover:bg-blue-700" : ""
        }`}
      >
        {hasActiveSubscription ? "Switch Plan" : "Subscribe Now"}
      </CheckoutButton>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {renderHeader()}
      <main className={`py-24 ${isAuthenticated && !isMobile ? 'md:ml-64' : ''}`}>
        <div className="container mx-auto px-4 relative">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/50 to-transparent -z-10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Plans for Every Career Stage
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
              <span className="text-black">Invest</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                in Your Future
              </span>
              <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
            </h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {hasActiveSubscription 
                ? "You're currently on the " + currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1) + " plan. You can switch plans anytime."
                : "Choose the plan that works best for you. All plans include our core AI-powered resume features."}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Monthly Plan */}
            <motion.div 
              className="relative overflow-hidden border rounded-2xl p-8 pt-12 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 mt-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative corner gradient */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-80 rounded-full"></div>
              
              {hasActiveSubscription && currentPlan === 'monthly' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full shadow-lg z-10">
                  <span className="text-sm font-medium text-white flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
                  Monthly Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">Monthly</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              
              <motion.ul 
                className="space-y-4 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <PricingFeature text="Unlimited resume creations" />
                <PricingFeature text="AI-powered suggestions" />
                <PricingFeature text="Multiple templates" />
                <PricingFeature text="Export to PDF" />
                <PricingFeature text="24/7 support" />
              </motion.ul>
              
              {renderSubscriptionButton("monthly")}
            </motion.div>

            {/* Yearly Plan */}
            <motion.div 
              className={`relative border-2 ${hasActiveSubscription && currentPlan === 'yearly' ? 'border-green-500' : 'border-primary'} rounded-2xl p-8 pt-12 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform md:scale-105 z-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 mt-6`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Spotlight effect */}
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 animate-pulse rounded-2xl"></div>
              
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-lg z-10 
               ${hasActiveSubscription && currentPlan === 'yearly' ? 'bg-green-500' : 'bg-primary'}">
                <span className="text-sm font-medium text-white flex items-center">
                  {hasActiveSubscription && currentPlan === 'yearly' ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <Star className="w-3 h-3 mr-1 animate-pulse" />
                      Most Popular
                    </>
                  )}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-primary/80 text-white px-3 py-1 text-xs font-medium rounded-full mb-2">
                  Yearly Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">Yearly</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">$7.49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm mt-2 text-muted-foreground">Billed annually ($89.88/year)</p>
              </div>
              
              <motion.ul 
                className="space-y-4 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                <PricingFeature text="Everything in Monthly" highlight />
                <PricingFeature text="Save 25% annually" highlight />
                <PricingFeature text="Priority support" highlight />
                <PricingFeature text="Early access to new features" highlight />
                <PricingFeature text="LinkedIn integration" highlight />
              </motion.ul>
              
              {renderSubscriptionButton("yearly")}
            </motion.div>

            {/* Lifetime Plan */}
            <motion.div 
              className="relative overflow-hidden border rounded-2xl p-8 pt-12 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 mt-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Decorative corner gradient */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 opacity-80 rounded-full"></div>
              
              {hasActiveSubscription && currentPlan === 'lifetime' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full shadow-lg z-10">
                  <span className="text-sm font-medium text-white flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
                  Lifetime Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">Lifetime</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">$199</span>
                  <span className="text-muted-foreground">/one-time</span>
                </div>
              </div>
              
              <motion.ul 
                className="space-y-4 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.6
                    }
                  }
                }}
              >
                <PricingFeature text="Everything in Yearly" />
                <PricingFeature text="Lifetime updates" />
                <PricingFeature text="VIP support" />
                <PricingFeature text="Custom branding" />
                <PricingFeature text="API access" />
              </motion.ul>
              
              {renderSubscriptionButton("lifetime")}
            </motion.div>
          </div>
          
          {/* Extra info section */}
          <motion.div 
            className="max-w-2xl mx-auto text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="inline-flex items-center p-4 rounded-xl bg-accent/80 backdrop-blur-sm mb-6">
              <div className="flex flex-col items-center p-3 rounded-lg">
                <h4 className="font-medium text-secondary">Satisfaction Guaranteed</h4>
                <p className="text-sm text-muted-foreground">14-day money-back guarantee</p>
              </div>
              <div className="h-10 w-px bg-muted mx-4"></div>
              <div className="flex flex-col items-center p-3 rounded-lg">
                <h4 className="font-medium text-secondary">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Questions about our pricing? <a href="/contact" className="text-primary hover:underline">Contact our team</a>
            </p>
          </motion.div>
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
};

const PricingFeature = ({ text, highlight = false }: { text: string; highlight?: boolean }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.li 
      className={`flex items-center gap-2 group ${highlight ? 'font-medium' : ''}`}
      variants={itemVariants}
    >
      <div className={`rounded-full p-1 group-hover:scale-110 transition-transform ${
        highlight ? 'bg-primary/20' : 'bg-primary/10'
      }`}>
        <Check className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-primary/80'}`} />
      </div>
      <span className={`${highlight ? 'text-secondary' : 'text-muted-foreground'} group-hover:text-primary transition-colors`}>
        {text}
      </span>
    </motion.li>
  );
};

export default Pricing;
