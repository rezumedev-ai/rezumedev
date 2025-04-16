
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // The ProtectedRoute doesn't need to be modified since it only checks 
  // if the user is authenticated, not their subscription status.
  // The subscription-specific checks are handled in individual components.
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for authentication to initialize
    if (!loading) {
      if (!user) {
        // Save current location to redirect back after login
        const returnPath = location.pathname !== "/login" ? location.pathname : undefined;
        navigate("/login", { 
          replace: true,
          state: returnPath ? { returnTo: returnPath } : undefined
        });
      }
      setIsInitialized(true);
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};
