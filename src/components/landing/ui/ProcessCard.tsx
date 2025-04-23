
import React from "react";
import * as LucideIcons from "lucide-react";

// Define valid icon names from lucide-react
type LucideIconName = keyof typeof LucideIcons;

interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
  iconName: LucideIconName;
  animationDelay?: number;
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  number,
  title,
  description,
  iconName,
  animationDelay = 0
}) => {
  // Get the icon component from Lucide
  const IconComponent = React.useMemo(() => {
    // Check if the icon exists in the Lucide library
    if (LucideIcons[iconName]) {
      return LucideIcons[iconName];
    }
    // Return null if the icon doesn't exist
    return null;
  }, [iconName]);
  
  return (
    <div
      className="group p-6 transition-all bg-white rounded-2xl hover:shadow-xl animate-slide-up-fade relative overflow-hidden hover-lift"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 mb-4 text-lg font-semibold text-primary bg-accent rounded-xl group-hover:scale-110 transition-transform">
          {IconComponent && React.createElement(IconComponent, { className: "w-6 h-6" })}
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
