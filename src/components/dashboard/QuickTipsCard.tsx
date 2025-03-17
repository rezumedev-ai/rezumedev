
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface QuickTipsCardProps {
  onShowTips: () => void;
}

export function QuickTipsCard({ onShowTips }: QuickTipsCardProps) {
  return (
    <motion.div variants={item}>
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Tips</h3>
            <Button variant="ghost" size="sm" onClick={onShowTips}>
              <Star className="h-4 w-4 text-amber-400 mr-1" />
              More Tips
            </Button>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Tailor your resume for each job application</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Quantify achievements with numbers when possible</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-green-100 p-1 mt-0.5">
                <Check className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Use keywords from the job description</p>
            </li>
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
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
