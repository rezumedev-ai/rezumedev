
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
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

  return user ? <Outlet /> : null;
};
