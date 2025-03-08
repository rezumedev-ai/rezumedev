
import { Link } from "react-router-dom";

export const SimplifiedHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-primary transition-colors group-hover:text-primary-hover">
              Rezume.dev
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
