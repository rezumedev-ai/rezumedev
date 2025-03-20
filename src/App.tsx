
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import './App.css';

// Import page components
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Guides from './pages/Guides';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Careers from './pages/Careers';
import PaymentSuccess from './pages/PaymentSuccess';
import Dashboard from './pages/Dashboard';
import NewResume from './pages/NewResume';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';
import Subscription from './pages/Subscription';

// Import custom components
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Redirect to onboarding if it's the first load and user is logged in
    if (user && isFirstLoad && location.pathname !== '/onboarding') {
      navigate('/onboarding');
      setIsFirstLoad(false); // Prevent further redirects
    }
  }, [user, isFirstLoad, location.pathname, navigate]);

  return (
    <div className="app">
      <div className="app-wrapper">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-resume" element={<NewResume />} />
            <Route path="/resume-builder/:id" element={<ResumeBuilder />} />
            <Route path="/resume-preview/:id" element={<ResumePreview />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/subscription" element={<Subscription />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
