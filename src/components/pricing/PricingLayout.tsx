
import { ReactNode, useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

interface PricingLayoutProps {
  children: ReactNode;
}

export function PricingLayout({ children }: PricingLayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  const renderHeader = () => {
    if (isAuthenticated) {
      if (isMobile) {
        return (
          <div className="md:hidden">
            <SimplifiedHeader />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        );
      } else {
        return (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        );
      }
    } else {
      return <Header />;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {renderHeader()}
      <main className={`py-24 ${isAuthenticated && !isMobile ? 'md:ml-64' : ''}`}>
        <div className="container mx-auto px-4 relative">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-accent/50 to-transparent -z-10"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          
          {children}
        </div>
      </main>
      {!isAuthenticated && <Footer />}
    </div>
  );
}
