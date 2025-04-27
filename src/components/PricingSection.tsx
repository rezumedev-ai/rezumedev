import { Check, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/payment/CheckoutButton";
import { ManageSubscriptionButton } from "@/components/payment/ManageSubscriptionButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PricingSection = () => {
  const { user } = useAuth();
  
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
      badgeColor: "bg-blue-100 text-blue-700",
      delay: 0.1
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
        "Early access to new features"
      ],
      cta: "Start Yearly",
      link: "/pricing",
      popular: true,
      color: "from-violet-500/20 to-purple-500/20",
      badgeColor: "bg-primary/80 text-white",
      delay: 0.2
    },
    {
      name: "Lifetime",
      price: "$199",
      period: "one-time",
      description: "Never pay again with our comprehensive lifetime package.",
      features: [
        "Everything in Yearly",
        "Lifetime updates",
        "VIP support"
      ],
      cta: "Get Lifetime",
      link: "/pricing",
      popular: false,
      color: "from-emerald-500/20 to-green-500/20",
      badgeColor: "bg-emerald-100 text-emerald-700",
      delay: 0.3
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-white sm:py-32">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/50 to-transparent"></div>
      <motion.div 
        className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      ></motion.div>
      
      <div className="container relative z-10">
        <motion.div 
          className="max-w-2xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-1.5 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Plans for Every Career Stage
          </motion.div>
          
          <motion.h2 
            className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-black">Invest</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
              in Your Career Success
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Choose the perfect plan for your career journey. All plans include our core AI-powered resume features.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative p-8 pt-10 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${tier.popular ? 'border-primary md:scale-105 z-10' : 'border-gray-200'} overflow-hidden`}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${tier.color} opacity-80 rounded-full`}
                animate={{ 
                  rotate: [0, 15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              ></motion.div>
              
              <motion.div 
                className="mb-4 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: tier.delay }}
              >
                <span className={`inline-block ${tier.badgeColor} px-3 py-1 text-xs font-medium rounded-full mb-2`}>
                  {tier.name} Plan
                </span>
                <h3 className="text-xl font-semibold text-secondary">{tier.name}</h3>
              </motion.div>
              
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: tier.delay + 0.1 }}
              >
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">{tier.price}</span>
                  <span className="ml-2 text-muted-foreground">/{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </motion.div>
              
              <motion.div 
                className="space-y-4 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: tier.delay + 0.2
                    }
                  }
                }}
              >
                {tier.features.map((feature) => (
                  <motion.div 
                    key={feature} 
                    className="flex items-start gap-3 group"
                    variants={featureVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className={`rounded-full p-1 bg-gradient-to-br ${tier.color} group-hover:scale-110 transition-transform`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: tier.delay + 0.4 }}
              >
                <Button 
                  asChild 
                  className={`w-full group ${tier.popular ? 'bg-primary hover:bg-primary-hover' : ''}`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link to={tier.link}>
                    {tier.cta}
                    <motion.span 
                      className="ml-2 transition-transform"
                      animate={{ x: [0, 4, 0] }} 
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        repeatType: "reverse", 
                        repeatDelay: 1 
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/80 backdrop-blur-sm mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-secondary">
                All plans include a 14-day money-back guarantee
              </p>
            </div>
          </motion.div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            <Link 
              to="/pricing"
              className="text-primary hover:underline flex items-center justify-center gap-1"
            >
              <span>View all plan details and features</span>
              <motion.span 
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                →
              </motion.span>
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-2xl mx-auto mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {hasActiveSubscription ? (
            <div className="space-y-4">
              <ManageSubscriptionButton variant="outline" />
              <p className="text-sm text-muted-foreground mt-2">
                Manage your subscription, billing information, and payment methods
              </p>
            </div>
          ) : (
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-accent/80 backdrop-blur-sm mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-secondary">
                  All plans include a 14-day money-back guarantee
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
