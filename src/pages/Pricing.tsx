
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles } from "lucide-react";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ExtraInfo } from "@/components/pricing/ExtraInfo";
import { usePricing } from "@/hooks/use-pricing";
import { FreePlan } from "@/components/pricing/plans/FreePlan";
import { MonthlyPlan } from "@/components/pricing/plans/MonthlyPlan";
import { YearlyPlan } from "@/components/pricing/plans/YearlyPlan";
import { LifetimePlan } from "@/components/pricing/plans/LifetimePlan";

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
            <FreePlan 
              hasActiveSubscription={!!hasActiveSubscription} 
              currentPlan={currentPlan}
            />
            <MonthlyPlan 
              hasActiveSubscription={!!hasActiveSubscription} 
              currentPlan={currentPlan}
            />
            <YearlyPlan 
              hasActiveSubscription={!!hasActiveSubscription} 
              currentPlan={currentPlan}
            />
            <LifetimePlan 
              hasActiveSubscription={!!hasActiveSubscription} 
              currentPlan={currentPlan}
            />
          </div>
          
          <ExtraInfo />
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
};

export default Pricing;
