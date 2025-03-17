
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export function DashboardLoading() {
  return (
    <motion.div variants={item}>
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="h-96 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading your resumes...</p>
        </div>
      </Card>
    </motion.div>
  );
}

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
