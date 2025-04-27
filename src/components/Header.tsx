
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileQuery } from "@/components/dashboard/resume-list/useProfileQuery";
import { Sparkles } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery(user);

  const hasActiveSubscription = profile?.subscription_status === 'active';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Rezume.dev
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            {hasActiveSubscription && (
              <Badge 
                variant="secondary" 
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Premium Subscriber
              </Badge>
            )}
            {user ? (
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
