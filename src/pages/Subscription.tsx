
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SimplifiedHeader } from "@/components/SimplifiedHeader";
import { SubscriptionManager } from "@/components/payment/SubscriptionManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { returnTo: "/subscription" } });
    }
  }, [user, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col">
        {isMobile ? (
          <SimplifiedHeader />
        ) : null}
        
        <main className={`flex-1 p-4 md:p-8 ${!isMobile ? 'md:ml-64' : ''}`}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
              <Button 
                variant="ghost" 
                onClick={handleGoBack}
                className="p-0 mr-4 hover:bg-transparent"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span>Back</span>
              </Button>
              
              <h1 className="text-2xl font-bold">Subscription Management</h1>
            </div>
            
            <SubscriptionManager />
          </div>
        </main>
      </div>
      
      {isMobile && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Subscription;
