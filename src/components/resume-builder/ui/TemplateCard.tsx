
import { ResumeTemplate } from "../templates";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "./Badge";

interface TemplateCardProps {
  template: {
    name: string;
    image: string;
    description: string;
    category?: string;
    color?: string;
  };
  withActions?: boolean;
  className?: string;
}

export function TemplateCard({ 
  template, 
  withActions = true,
  className 
}: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className={cn(
        "group h-full flex flex-col overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="relative bg-slate-900 rounded-t-xl overflow-hidden">
        {/* Premium badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            variant="warning" 
            size="sm"
            icon={<Sparkles className="w-3 h-3 text-amber-300" />}
          >
            Premium
          </Badge>
        </div>
        
        {/* Template image */}
        <AspectRatio ratio={8.5/11} className="w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img 
            src={template.image} 
            alt={template.name}
            className="w-full h-full object-contain"
          />
        </AspectRatio>
        
        {/* Hover overlay */}
        {withActions && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link to="/signup" className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button variant="default" size="sm" className="font-medium">
                Use This Template
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white flex-grow flex flex-col">
        {template.category && (
          <div className={cn(
            "inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-2 text-white",
            template.color || "bg-primary"
          )}>
            {template.category}
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
          {template.description}
        </p>
        
        {withActions && (
          <Link to="/signup" className="mt-auto">
            <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary hover:bg-primary/5">
              Preview Template
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
