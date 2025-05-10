
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isPublicRoute } from "@/lib/utils";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  signOut: async () => {},
  getAuthToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Helper function to get current auth token
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      console.log("🔑 AUTH: Retrieved token:", token ? `${token.substring(0, 10)}...` : "No token found");
      return token;
    } catch (error) {
      console.error("🔴 ERROR: Failed to get auth token:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Log session info for debugging
        if (session) {
          console.log("🔑 AUTH: Active session found for:", session.user.email);
          console.log("🔑 AUTH: Token expires at:", new Date(session.expires_at * 1000).toLocaleString());
          console.log("🔑 AUTH: Token available:", session.access_token ? "Yes" : "No");
          
          // Check if token is stored in localStorage
          const hasLocalToken = localStorage.getItem('supabase.auth.token') !== null;
          console.log("🔑 AUTH: Token in localStorage:", hasLocalToken ? "Yes" : "No");
        } else {
          console.log("🔑 AUTH: No active session found");
        }
        
        setUser(session?.user ?? null);
        
        // Only redirect to login if we're not on a public route and there's no session
        const currentPath = location.pathname;
        if (!session && !isPublicRoute(currentPath)) {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error("🔴 ERROR: Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔑 AUTH: Auth state changed:", event, "User:", session?.user?.email);
      setUser(session?.user ?? null);
      
      // Log token information whenever auth state changes
      if (session) {
        console.log("🔑 AUTH: New token available:", session.access_token ? "Yes" : "No");
        console.log("🔑 AUTH: Token expires at:", new Date(session.expires_at * 1000).toLocaleString());
      }
      
      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          navigate('/dashboard', { replace: true });
          break;
        case 'SIGNED_OUT':
          // Only redirect to login if we're not trying to access a public route
          if (!isPublicRoute(location.pathname)) {
            navigate('/login', { replace: true });
          }
          break;
        case 'TOKEN_REFRESHED':
          // Session has been refreshed, update the user
          console.log("🔑 AUTH: Token was refreshed");
          setUser(session?.user ?? null);
          break;
        case 'USER_UPDATED':
          setUser(session?.user ?? null);
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });

      // Clear any persisted tokens
      localStorage.removeItem('supabase.auth.token');
      
      // Ensure user is set to null
      setUser(null);
      
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('🔴 ERROR: Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred while signing out",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, getAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
