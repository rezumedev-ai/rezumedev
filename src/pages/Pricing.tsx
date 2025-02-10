
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-secondary mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground mb-8">Choose the plan that works best for you</p>
            <div className="inline-block bg-accent px-6 py-3 rounded-full">
              <p className="text-primary font-medium">🎉 Currently FREE during our beta phase!</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Monthly Plan */}
            <div className="border rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Monthly</h3>
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
              <Button className="w-full" disabled>Coming Soon</Button>
            </div>

            {/* Yearly Plan */}
            <div className="border rounded-lg p-8 bg-primary text-white shadow-lg transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent px-4 py-1 rounded-full">
                <span className="text-sm font-medium text-primary">Most Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Yearly</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$7.49</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>
              <p className="text-sm mb-6 text-primary-foreground/80">Billed annually ($89.88/year)</p>
              <ul className="space-y-4 mb-8">
                <PricingFeature text="Everything in Monthly" light />
                <PricingFeature text="Save 25% annually" light />
                <PricingFeature text="Priority support" light />
                <PricingFeature text="Early access to new features" light />
                <PricingFeature text="LinkedIn integration" light />
              </ul>
              <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
            </div>

            {/* Lifetime Plan */}
            <div className="border rounded-lg p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Lifetime</h3>
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
              <Button className="w-full" disabled>Coming Soon</Button>
            </div>
          </div>

          {/* Beta Notice */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto bg-muted p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">🚀 Beta Access</h3>
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

const PricingFeature = ({ text, light = false }: { text: string; light?: boolean }) => (
  <li className="flex items-center gap-2">
    <Check className={`h-5 w-5 ${light ? 'text-primary-foreground' : 'text-primary'}`} />
    <span className={light ? 'text-primary-foreground' : 'text-muted-foreground'}>{text}</span>
  </li>
);

export default Pricing;
