
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const { user } = useAuth();
  const betaPhase = true; // Set to false when ready to enable payments

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
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
              Choose the plan that works best for you. Get started for free and upgrade anytime.
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
              <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-t-2xl"></div>
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
              {betaPhase ? (
                <Button className="w-full hover:scale-105 transition-transform" disabled>Coming Soon</Button>
              ) : (
                <CheckoutButton
                  planType="monthly"
                  className="w-full hover:scale-105 transition-transform"
                >
                  Subscribe Now
                </CheckoutButton>
              )}
            </div>

            {/* Yearly Plan */}
            <div className="relative border-2 border-primary rounded-2xl p-8 bg-gradient-to-b from-primary/5 to-transparent shadow-lg transform scale-105 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full">
                <span className="text-sm font-medium text-white">Most Popular</span>
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
              {betaPhase ? (
                <Button variant="default" className="w-full hover:scale-105 transition-transform bg-primary hover:bg-primary/90" disabled>Coming Soon</Button>
              ) : (
                <CheckoutButton
                  planType="yearly"
                  className="w-full hover:scale-105 transition-transform bg-primary hover:bg-primary/90"
                >
                  Subscribe Now
                </CheckoutButton>
              )}
            </div>

            {/* Lifetime Plan */}
            <div className="relative border rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-t-2xl"></div>
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
              {betaPhase ? (
                <Button className="w-full hover:scale-105 transition-transform" disabled>Coming Soon</Button>
              ) : (
                <CheckoutButton
                  planType="lifetime"
                  className="w-full hover:scale-105 transition-transform"
                >
                  Buy Now
                </CheckoutButton>
              )}
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
      <Footer />
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
