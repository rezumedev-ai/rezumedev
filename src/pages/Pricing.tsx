
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, CheckCircle, Star } from "lucide-react";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { PricingFeature } from "@/components/pricing/PricingFeature";
import { SubscriptionButton } from "@/components/pricing/SubscriptionButton";
import { ExtraInfo } from "@/components/pricing/ExtraInfo";
import { usePricing } from "@/hooks/use-pricing";
import { useState } from "react";

const Pricing = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, hasActiveSubscription, currentPlan, user } = usePricing();

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

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {/* Free Plan */}
            <motion.div 
              className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-gray-500/20 to-gray-600/20 opacity-80 rounded-full"></div>
              
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 text-xs font-medium rounded-full mb-2">
                  Free Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">Free</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <p className="text-sm mt-2 text-muted-foreground">Perfect for trying out our AI resume builder</p>
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
                <PricingFeature text="Create one resume" />
                <PricingFeature text="Basic templates" />
                <PricingFeature text="PDF export" />
                <PricingFeature text="Community support" />
              </motion.ul>
              
              <SubscriptionButton 
                planType="free"
                hasActiveSubscription={hasActiveSubscription}
                currentPlan={currentPlan}
              />
            </motion.div>

            {/* Monthly Plan */}
            <motion.div 
              className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-80 rounded-full"></div>
              
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
              
              <SubscriptionButton 
                planType="monthly"
                hasActiveSubscription={hasActiveSubscription}
                currentPlan={currentPlan}
              />
            </motion.div>

            {/* Yearly Plan */}
            <motion.div 
              className={`relative border-2 ${hasActiveSubscription && currentPlan === 'yearly' ? 'border-green-500' : 'border-primary'} rounded-2xl p-8 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform md:scale-105 z-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/0 animate-pulse rounded-2xl"></div>
              
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full shadow-lg">
                <span className="text-sm font-medium text-white flex items-center">
                  <Star className="w-3 h-3 mr-1 animate-pulse" />
                  Most Popular
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
                <PricingFeature text="Everything in Monthly" highlight={true} />
                <PricingFeature text="Save 25% annually" highlight={true} />
                <PricingFeature text="Priority support" highlight={true} />
                <PricingFeature text="Early access to new features" highlight={true} />
              </motion.ul>
              
              <SubscriptionButton 
                planType="yearly"
                hasActiveSubscription={hasActiveSubscription}
                currentPlan={currentPlan}
              />
            </motion.div>

            {/* Lifetime Plan */}
            <motion.div 
              className="relative overflow-hidden border rounded-2xl p-8 bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/20 opacity-80 rounded-full"></div>
              
              {hasActiveSubscription && currentPlan === 'lifetime' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full shadow-lg">
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
              </motion.ul>
              
              <SubscriptionButton 
                planType="lifetime"
                hasActiveSubscription={hasActiveSubscription}
                currentPlan={currentPlan}
              />
            </motion.div>
          </div>
          
          <ExtraInfo />
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default Pricing;
