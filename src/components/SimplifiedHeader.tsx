
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export const SimplifiedHeader = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg shadow-black/10' 
        : 'bg-white/80 backdrop-blur-md shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-xl font-bold transition-colors ${
                theme === 'dark'
                  ? 'text-white group-hover:text-primary'
                  : 'text-primary group-hover:text-primary-hover' 
              }`}
            >
              Rezume.dev
            </motion.span>
          </Link>
          
          <ThemeToggle className="dark-button-glow" />
        </div>
      </div>
    </header>
  );
};
