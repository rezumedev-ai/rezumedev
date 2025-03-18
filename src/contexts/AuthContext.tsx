
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { isPublicRoute } from "@/lib/utils";
import { sendWelcomeEmail } from "@/utils/email-service";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        setUser(session?.user ?? null);
        
        // Only redirect to login if we're not on a public route and there's no session
        const currentPath = location.pathname;
        if (!session && !isPublicRoute(currentPath)) {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "User:", session?.user?.email);
      setUser(session?.user ?? null);
      
      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          // If this is a new sign-in (not just a refresh), send a welcome email
          if (session?.user) {
            const fullName = session.user.user_metadata?.full_name || "there";
            await sendWelcomeEmail(session.user.email!, fullName);
          }
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
