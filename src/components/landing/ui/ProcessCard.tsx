
import React from "react";
import * as LucideIcons from "lucide-react";

interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
  iconName: keyof typeof LucideIcons;
  animationDelay?: number;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  number,
  title,
  description,
  iconName,
  animationDelay = 0
}) => {
  // Dynamically get the icon component
  const IconComponent = LucideIcons[iconName];
  
  return (
    <div
      className="group p-6 transition-all bg-white rounded-2xl hover:shadow-xl animate-slide-up-fade relative overflow-hidden hover-lift"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-semibold text-primary bg-accent rounded-xl group-hover:scale-110 transition-transform">
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-secondary group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
