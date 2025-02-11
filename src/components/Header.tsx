
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-primary transition-colors group-hover:text-primary-hover">
              Rezume.dev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { path: '/features', label: 'Features' },
              { path: '/pricing', label: 'Pricing' },
              { path: '/blog', label: 'Blog' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-all relative hover-lift ${
                  location.pathname === path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                } after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-0.5 after:bg-primary after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild className="hover-lift">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="hover-lift animate-soft-bounce">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white shadow-lg border-t animate-expand z-50">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/features"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  to="/blog"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <div className="pt-4 space-y-2 border-t">
                  <Button variant="ghost" className="w-full hover-lift" asChild>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button className="w-full hover-lift" asChild>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
