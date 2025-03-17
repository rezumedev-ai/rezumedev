
import { Check, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PricingSection = () => {
  const tiers = [
    {
      name: "Monthly",
      price: "$9.99",
      period: "per month",
      description: "Perfect for job seekers looking for short-term resume tools.",
      features: [
        "Unlimited resume creations",
        "AI-powered suggestions",
        "Multiple templates",
        "Export to PDF",
        "24/7 support"
      ],
      cta: "Start Monthly",
      link: "/pricing",
      popular: false,
      color: "from-blue-500/20 to-cyan-500/20",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      name: "Yearly",
      price: "$7.49",
      period: "per month",
      description: "Our most popular plan with the best value for serious job hunters.",
      features: [
        "Everything in Monthly",
        "Save 25% annually",
        "Priority support",
        "Early access to new features",
        "LinkedIn integration"
      ],
      cta: "Start Yearly",
      link: "/pricing",
      popular: true,
      color: "from-violet-500/20 to-purple-500/20",
      badgeColor: "bg-primary/80 text-white"
    },
    {
      name: "Lifetime",
      price: "$199",
      period: "one-time",
      description: "Never pay again with our comprehensive lifetime package.",
      features: [
        "Everything in Yearly",
        "Lifetime updates",
        "VIP support",
        "Custom branding",
        "API access"
      ],
      cta: "Get Lifetime",
      link: "/pricing",
      popular: false,
      color: "from-emerald-500/20 to-green-500/20",
      badgeColor: "bg-emerald-100 text-emerald-700"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-white sm:py-32">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/50 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Plans for Every Career Stage
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-secondary md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            Invest in Your Career Success
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your career journey. All plans include our core AI-powered resume features.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${tier.popular ? 'border-primary md:scale-105' : 'border-gray-200'} overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Decorative corner gradient */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${tier.color} opacity-80 rounded-full`}></div>
              
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full shadow-sm bg-primary">
                  <span className="text-sm font-medium text-white">Most Popular</span>
                </div>
              )}
              
              {/* Badge and Name */}
              <div className="mb-4">
                <span className={`inline-block ${tier.badgeColor} px-3 py-1 text-xs font-medium rounded-full mb-2`}>
                  {tier.name} Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">{tier.name}</h3>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="ml-2 text-muted-foreground">/{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </div>
              
              {/* Features */}
              <div className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 group">
                    <div className={`rounded-full p-1 bg-gradient-to-br ${tier.color} group-hover:scale-110 transition-transform`}>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <div className="mt-auto">
                <Button 
                  asChild 
                  className={`w-full group ${tier.popular ? 'bg-primary hover:bg-primary-hover' : ''}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link to={tier.link}>
                    {tier.cta}
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Extra Info */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <Link 
            to="/pricing"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary bg-accent rounded-full hover:bg-accent/80 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            View all plan details and features
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            All plans include a 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
