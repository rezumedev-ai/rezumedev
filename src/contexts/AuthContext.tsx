
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  signOut: async () => {},
});

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/features', '/pricing', '/blog'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Only redirect to login if we're not on a public route and there's no session
      const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
      if (!session && !isPublicRoute) {
        navigate('/login');
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          navigate('/dashboard');
          break;
        case 'SIGNED_OUT':
          // Only redirect to login if we're not trying to access a public route
          if (!PUBLIC_ROUTES.includes(location.pathname)) {
            navigate('/login');
          }
          break;
        case 'TOKEN_REFRESHED':
          // Session has been refreshed, update the user
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
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error instanceof Error ? error.message : "An error occurred while signing out",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
