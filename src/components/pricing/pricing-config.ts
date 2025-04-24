
export const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our AI resume builder.",
    features: [
      "Create one resume",
      "Basic templates",
      "PDF export",
      "Community support"
    ],
    cta: "Get Started Free",
    link: "/signup",
    popular: false,
    color: "from-gray-500/20 to-gray-600/20",
    badgeColor: "bg-gray-100 text-gray-700",
    delay: 0.1
  },
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
] as const;
