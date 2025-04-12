
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Sitemap = () => {
  return (
    <>
      <Helmet>
        <title>Sitemap | Rezume.dev</title>
        <meta name="description" content="Navigate the full structure of Rezume.dev. Find all pages and sections in our website." />
        <link rel="canonical" href="https://rezume.dev/sitemap" />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center text-secondary">
            Sitemap
          </h1>
          
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Main Pages */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                Main Pages
              </h2>
              <ul className="space-y-3">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                Resources
              </h2>
              <ul className="space-y-3">
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/guides" className="text-muted-foreground hover:text-primary transition-colors">Career Guides</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                Company
              </h2>
              <ul className="space-y-3">
                <li><Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                Legal
              </h2>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
            
            {/* User Account */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                User Account
              </h2>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors">Settings</Link></li>
                <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help</Link></li>
              </ul>
            </div>
            
            {/* Resume Building */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary border-b pb-2">
                Resume Building
              </h2>
              <ul className="space-y-3">
                <li><Link to="/new-resume" className="text-muted-foreground hover:text-primary transition-colors">Create New Resume</Link></li>
                <li><Link to="/resume-builder" className="text-muted-foreground hover:text-primary transition-colors">Resume Builder</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Blog Articles Section */}
          <div className="mt-12 max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold text-primary border-b pb-2 mb-6">
              Blog Articles
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link to="/blog/1" className="text-muted-foreground hover:text-primary transition-colors">10 Essential Tips for Crafting a Winning Resume</Link>
              <Link to="/blog/2" className="text-muted-foreground hover:text-primary transition-colors">Mastering the Art of Job Search in 2024</Link>
              <Link to="/blog/3" className="text-muted-foreground hover:text-primary transition-colors">What Hiring Managers Really Look For</Link>
              <Link to="/blog/4" className="text-muted-foreground hover:text-primary transition-colors">How to Write a Resume for Remote Jobs</Link>
              <Link to="/blog/5" className="text-muted-foreground hover:text-primary transition-colors">Cover Letter vs Resume: Do You Still Need Both?</Link>
              <Link to="/blog/6" className="text-muted-foreground hover:text-primary transition-colors">From Zero to Hired: How I Landed My Dream Job with Rezume.dev</Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Sitemap;
