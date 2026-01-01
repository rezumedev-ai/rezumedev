
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { OnboardingGuard } from "./components/onboarding/OnboardingGuard";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Guides from "./pages/Guides";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NewResume from "./pages/NewResume";
import PaymentSuccess from "./pages/PaymentSuccess";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AppSumoSignUp from "./pages/AppSumoSignUp";
import ChangePassword from "./pages/ChangePassword";
import ProfileSelection from "./pages/ProfileSelection"; // Add this import
import FAQ from "./pages/FAQ";
import { MetaPixelPageTracker } from "@/components/analytics/MetaPixelTracker";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});



function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <AuthProvider>
              <MetaPixelPageTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/appsumo" element={<AppSumoSignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/features" element={<Features />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <OnboardingGuard>
                        <Dashboard />
                      </OnboardingGuard>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  }
                />
                {/* Add profiles route */}
                <Route
                  path="/profiles"
                  element={
                    <ProtectedRoute>
                      <ProfileSelection />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/new-resume"
                  element={
                    <ProtectedRoute>
                      <NewResume />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume-builder/:id?"
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resume-preview/:id"
                  element={
                    <ProtectedRoute>
                      <ResumePreview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <OnboardingFlow />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
