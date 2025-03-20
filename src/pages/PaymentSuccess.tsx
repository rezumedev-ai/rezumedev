
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-accent/10">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={80} className="text-green-500" />
              </motion.div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            
            <p className="text-muted-foreground mb-8">
              Thank you for subscribing to Rezume.dev! Your payment has been processed successfully.
              You now have access to all premium features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button asChild>
                <Link to="/new-resume">
                  Create a Resume
                </Link>
              </Button>
              
              <Button asChild variant="secondary">
                <Link to="/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
