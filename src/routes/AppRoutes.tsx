
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import SignUp from "@/pages/SignUp";
import Login from "@/pages/Login";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Cookies from "@/pages/Cookies";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Features from "@/pages/Features";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Guides from "@/pages/Guides";
import AffiliateHome from "@/pages/AffiliateHome";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from "@/pages/PaymentSuccess";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Help from "@/pages/Help";
import NewResume from "@/pages/NewResume";
import ResumeBuilder from "@/pages/ResumeBuilder";
import ResumePreview from "@/pages/ResumePreview";
import Onboarding from "@/pages/Onboarding";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import AffiliateApplication from "@/pages/AffiliateApplication";
import AffiliatePayouts from "@/pages/AffiliatePayouts";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/guides" element={<Guides />} />
      <Route path="/affiliate" element={<AffiliateHome />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* Protected Routes */}
      <Route path="/affiliate/*" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<AffiliateDashboard />} />
        <Route path="apply" element={<AffiliateApplication />} />
        <Route path="payouts" element={<AffiliatePayouts />} />
      </Route>

      <Route path="/app/*" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
        <Route path="new-resume" element={<NewResume />} />
        <Route path="resume-builder/:id?" element={<ResumeBuilder />} />
        <Route path="resume-preview/:id" element={<ResumePreview />} />
        <Route path="onboarding" element={<Onboarding />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
