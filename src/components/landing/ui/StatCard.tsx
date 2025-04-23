
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  iconColor?: string;
  iconFill?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
  iconColor,
  iconFill
}) => {
  return (
    <div className="bg-[#F1F0FB] rounded-xl py-6 flex flex-col items-center shadow">
      <Icon 
        className={`w-6 h-6 mb-2 ${iconColor ? '' : 'text-primary'}`} 
        color={iconColor} 
        fill={iconFill} 
      />
      <div className="text-md text-muted-foreground mb-1 font-medium">{label}</div>
      <div className="text-2xl md:text-3xl font-bold" style={{ color }}>{value}</div>
    </div>
  );
};
