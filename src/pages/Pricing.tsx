
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle } from "lucide-react";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const betaPhase = false; // Changed from true to false to enable payments
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user profile to get subscription details
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
  const currentPlan = profile?.subscription_plan;

  // Check if the user is on a dashboard route
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  // Determine which header to show based on authentication
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

  // Function to render the subscription button based on plan
  const renderSubscriptionButton = (planType: string) => {
    if (betaPhase) {
      return <Button className="w-full hover:scale-105 transition-transform" disabled>Coming Soon</Button>;
    }

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
    <div className="min-h-screen bg-white">
      {renderHeader()}
      <main className={`py-24 ${isAuthenticated && !isMobile ? 'md:ml-64' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 relative">
              <span className="text-secondary">Simple, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Transparent Pricing
              </span>
              <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
              {hasActiveSubscription 
                ? "You're currently on the " + currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1) + " plan. You can switch plans anytime."
                : "Choose the plan that works best for you. Get started for free and upgrade anytime."}
            </p>
            {betaPhase && (
              <div 
                className="inline-block bg-accent/50 backdrop-blur-sm px-6 py-3 rounded-full animate-bounce hover:scale-105 transition-transform cursor-pointer"
                style={{ animationDuration: '3s' }}
              >
                <p className="text-primary font-medium">🎉 Currently FREE during our beta phase!</p>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Monthly Plan */}
            <div className="relative border rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '100ms' }}>
              {hasActiveSubscription && currentPlan === 'monthly' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full">
                  <span className="text-sm font-medium text-white">Current Plan</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4 text-secondary">Monthly</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Unlimited resume creations" />
                <PricingFeature text="AI-powered suggestions" />
                <PricingFeature text="Multiple templates" />
                <PricingFeature text="Export to PDF" />
                <PricingFeature text="24/7 support" />
              </ul>
              {renderSubscriptionButton('monthly')}
            </div>

            {/* Yearly Plan */}
            <div className={`relative border-2 ${hasActiveSubscription && currentPlan === 'yearly' ? 'border-green-500' : 'border-primary'} rounded-2xl p-8 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform scale-105 animate-fade-up`} style={{ animationDelay: '200ms' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full">
                <span className="text-sm font-medium text-white">
                  {hasActiveSubscription && currentPlan === 'yearly' ? 'Current Plan' : 'Most Popular'}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-secondary">Yearly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$7.49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm mb-6 text-muted-foreground">Billed annually ($89.88/year)</p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Everything in Monthly" />
                <PricingFeature text="Save 25% annually" />
                <PricingFeature text="Priority support" />
                <PricingFeature text="Early access to new features" />
                <PricingFeature text="LinkedIn integration" />
              </ul>
              {renderSubscriptionButton('yearly')}
            </div>

            {/* Lifetime Plan */}
            <div className="relative border rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '300ms' }}>
              {hasActiveSubscription && currentPlan === 'lifetime' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 px-4 py-1 rounded-full">
                  <span className="text-sm font-medium text-white">Current Plan</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4 text-secondary">Lifetime</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold">$199</span>
                <span className="text-muted-foreground">/one-time</span>
              </div>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Everything in Yearly" />
                <PricingFeature text="Lifetime updates" />
                <PricingFeature text="VIP support" />
                <PricingFeature text="Custom branding" />
                <PricingFeature text="API access" />
              </ul>
              {renderSubscriptionButton('lifetime')}
            </div>
          </div>

          {/* Beta Notice */}
          <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-accent/30 to-accent/10 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-secondary">🚀 Beta Access</h3>
              <p className="text-muted-foreground">
                During our beta phase, all features are completely FREE! Try out Rezume.dev and help us shape the future of AI-powered resume creation.
              </p>
            </div>
          </div>
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
};

const PricingFeature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 group">
    <div className="rounded-full bg-primary/10 p-1 group-hover:scale-110 transition-transform">
      <Check className="h-4 w-4 text-primary" />
    </div>
    <span className="text-muted-foreground group-hover:text-primary transition-colors">{text}</span>
  </li>
);

export default Pricing;
