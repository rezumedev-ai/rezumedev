
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ThemeToggle({ 
  variant = "ghost", 
  size = "icon",
  className = ""
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
      aria-label="Toggle theme"
    >
      <span className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-transparent'} opacity-0 transition-opacity duration-300 rounded-md ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
      
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-0 scale-100 ${theme === 'dark' ? 'rotate-90 scale-0' : 'text-amber-500'}`} />
      
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 rotate-90 scale-0 ${theme === 'dark' ? 'rotate-0 scale-100 text-sky-400' : ''}`} />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
