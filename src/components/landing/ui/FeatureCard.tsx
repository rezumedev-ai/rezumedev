
import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  upcoming?: boolean;
  animationDelay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  upcoming = false,
  animationDelay = 0
}) => {
  return (
    <div
      className="group relative overflow-hidden p-8 transition-all bg-white rounded-2xl hover:shadow-xl hover:shadow-primary/5 animate-scale-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={`absolute inset-0 opacity-0 bg-gradient-to-br ${gradient} group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center w-14 h-14 mb-6 text-white transition-transform bg-primary rounded-xl group-hover:scale-110 group-hover:rotate-3">
          <Icon className="w-7 h-7" />
        </div>
        
        <h3 className="mb-3 text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
          {title}
          {upcoming && (
            <span className="ml-2 px-2 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-full">
              Soon
            </span>
          )}
        </h3>
        
        <p className="mb-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
