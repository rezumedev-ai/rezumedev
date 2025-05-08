
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Calendar, Download, Share2, Star, GiftIcon, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    plan: "",
    renewalDate: "",
    loading: true,
  });

  // Launch confetti effect on component mount
  useEffect(() => {
    // Track purchase conversion in Meta Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        currency: "USD",
        value: 1.00
      });
    }
    
    // Trigger confetti animation
    const launchConfetti = () => {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366F1', '#8B5CF6', '#D946EF']
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366F1', '#8B5CF6', '#D946EF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      
      runConfetti();
    };

    launchConfetti();

    // Fetch user's subscription details
    const fetchSubscriptionDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('subscription_plan, subscription_status, updated_at')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            // Format plan name to be more user-friendly
            let planName = "Premium";
            if (profileData.subscription_plan === "monthly") planName = "Monthly Premium";
            if (profileData.subscription_plan === "yearly") planName = "Yearly Premium";
            if (profileData.subscription_plan === "lifetime") planName = "Lifetime Premium";
            
            // Calculate renewal date if not lifetime
            let renewalDate = "";
            if (profileData.subscription_plan !== "lifetime") {
              const renewalDateObj = new Date(profileData.updated_at);
              renewalDateObj.setMonth(renewalDateObj.getMonth() + 
                (profileData.subscription_plan === "yearly" ? 12 : 1));
              renewalDate = renewalDateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              });
            }
            
            setSubscriptionDetails({
              plan: planName,
              renewalDate: renewalDate,
              loading: false
            });
          }
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setSubscriptionDetails(prev => ({ ...prev, loading: false }));
      }
    };

    fetchSubscriptionDetails();
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just upgraded to Premium on Rezume.dev!',
        text: 'I just upgraded my Rezume.dev account to access premium resume templates and AI features!',
        url: 'https://rezume.dev',
      })
      .catch((error) => console.log('Sharing failed', error));
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API.",
      });
    }
  };

  const premiumFeatures = [
    { icon: <Star className="h-5 w-5 text-amber-500" />, title: "Premium Templates", description: "Access all professional resume templates" },
    { icon: <Award className="h-5 w-5 text-blue-500" />, title: "AI Enhancements", description: "Unlimited AI powered resume reviews" },
    { icon: <GiftIcon className="h-5 w-5 text-green-500" />, title: "Priority Support", description: "Get help within 24 hours from our team" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-white to-accent/10">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="max-w-4xl w-full space-y-8">
          {/* Main success card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-accent shadow-lg">
              {/* Colored header stripe */}
              <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle size={86} className="text-green-500" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900">Payment Successful!</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Thank you for upgrading your Rezume.dev account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Subscription details */}
                <div className="rounded-xl bg-accent/30 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <span className="bg-primary/10 rounded-full p-2 mr-2">
                      <Calendar className="h-5 w-5 text-primary" />
                    </span>
                    Your Subscription Details
                  </h3>
                  
                  {subscriptionDetails.loading ? (
                    <div className="flex items-center justify-center h-16">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-medium">{subscriptionDetails.plan}</span>
                      </div>
                      
                      {subscriptionDetails.renewalDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Next Renewal:</span>
                          <span className="font-medium">{subscriptionDetails.renewalDate}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Premium features */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Features Now Available</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {premiumFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      >
                        <div className="flex items-start">
                          <div className="bg-primary/10 rounded-full p-2 mr-3">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 transition-all duration-300">
                    <Link to="/new-resume">
                      Create a Resume
                    </Link>
                  </Button>
                </div>
                
                {/* Additional actions */}
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                  <button 
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-primary flex items-center transition-colors"
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </button>
                  
                  <Link 
                    to="/settings" 
                    className="text-muted-foreground hover:text-primary flex items-center transition-colors"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    View Invoice
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <img
                  src="https://randomuser.me/api/portraits/women/17.jpg"
                  alt="Customer"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm text-muted-foreground italic">
                  "Since upgrading to Premium, I've received callbacks from 80% of the positions I applied for. The templates are professional and the AI suggestions truly enhanced my resume."
                </p>
                <p className="text-sm font-medium mt-2">Sarah Johnson, Marketing Professional</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
