
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
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
import AffiliateDashboard from "./pages/AffiliateDashboard";
import AffiliateApplication from "./pages/AffiliateApplication";
import AffiliatePayouts from "./pages/AffiliatePayouts";
import AffiliateHome from "./pages/AffiliateHome";

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
      <ErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AuthProvider>
                <TooltipProvider>
                  <Toaster />
                  <SonnerToaster />
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/signup" element={<SignUp />} />
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
                      <Route path="/affiliate" element={<AffiliateHome />} />
                      <Route
                        path="/affiliate/apply"
                        element={
                          <ProtectedRoute>
                            <AffiliateApplication />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/affiliate/dashboard"
                        element={
                          <ProtectedRoute>
                            <AffiliateDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/affiliate/payouts"
                        element={
                          <ProtectedRoute>
                            <AffiliatePayouts />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
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
                        path="/help"
                        element={
                          <ProtectedRoute>
                            <Help />
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
                            <Onboarding />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </TooltipProvider>
              </AuthProvider>
            </Router>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
