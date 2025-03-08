
import { Brain, MonitorPlay, ListOrdered, Lightbulb, LayoutDashboard, FileText, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export const Features = () => {
  const features = [
    {
      title: "AI-Powered Resume Builder",
      description: "Create ATS-compliant resumes with smart AI suggestions guiding you through each section",
      icon: Brain,
      gradient: "from-violet-500/20 to-purple-500/20",
      highlight: "bg-violet-100"
    },
    {
      title: "Live Resume Preview",
      description: "Watch your resume take shape in real-time as you type, ensuring professional formatting",
      icon: MonitorPlay,
      gradient: "from-blue-500/20 to-cyan-500/20",
      highlight: "bg-blue-100"
    },
    {
      title: "Step-by-Step Guidance",
      description: "Follow our structured process to build your perfect resume without feeling overwhelmed",
      icon: ListOrdered,
      gradient: "from-green-500/20 to-emerald-500/20",
      highlight: "bg-green-100"
    },
    {
      title: "Smart Content Suggestions",
      description: "Get personalized AI recommendations for every section of your resume",
      icon: Lightbulb,
      gradient: "from-yellow-500/20 to-orange-500/20",
      highlight: "bg-amber-100"
    },
    {
      title: "Minimalist Dashboard",
      description: "Manage all your resumes efficiently with our clean, user-friendly interface",
      icon: LayoutDashboard,
      gradient: "from-pink-500/20 to-rose-500/20",
      highlight: "bg-pink-100"
    },
    {
      title: "ATS-Friendly Templates",
      description: "Choose from professionally designed templates guaranteed to pass ATS systems",
      icon: FileText,
      gradient: "from-indigo-500/20 to-blue-500/20",
      highlight: "bg-indigo-100"
    },
    {
      title: "API Integrations (Coming Soon)",
      description: "Seamlessly connect with job portals and LinkedIn for effortless applications",
      icon: Network,
      gradient: "from-gray-500/20 to-slate-500/20",
      highlight: "bg-slate-100",
      upcoming: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="py-20 bg-white sm:py-32 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-secondary sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hover">
            Powerful Features for Your Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create professional, ATS-optimized resumes that stand out from the competition
          </p>
        </div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group relative overflow-hidden p-8 transition-all bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-primary/5 ${feature.highlight}`}
            >
              <div className={`absolute inset-0 opacity-0 bg-gradient-to-br ${feature.gradient} group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 mb-6 text-white transition-transform bg-primary rounded-xl group-hover:scale-110 group-hover:rotate-3 duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                
                <h3 className="mb-3 text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
                  {feature.title}
                  {feature.upcoming && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full">
                      Soon
                    </span>
                  )}
                </h3>
                
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
