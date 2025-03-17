
import { motion } from "framer-motion";
import { Layout, ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div className="space-y-4 w-full" variants={item}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Layout className="w-4 h-4" />
        <span>Dashboard</span>
        <ChevronRight className="w-4 h-4" />
        <span>Resumes</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Welcome back, {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary/60 animate-gradient">
              {userName || 'there'}!
            </span>
          </h1>
        </div>
        
        <p className="text-base md:text-lg text-gray-600 max-w-2xl" 
          style={{ animationDelay: '100ms' }}>
          Create and manage your professional resumes with our AI-powered platform. 
          Stand out from the crowd with beautifully crafted resumes.
        </p>
      </div>
    </motion.div>
  );
}
