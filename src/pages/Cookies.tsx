
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-4xl px-4 py-16 mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="mb-8 text-4xl font-bold text-secondary">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">1. What Are Cookies</h2>
            <p className="text-muted-foreground">Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and understand how you use our service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-secondary mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground">Required for the operation of our website, including keeping you signed in and maintaining your session.</p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary mb-2">Functionality Cookies</h3>
                <p className="text-muted-foreground">Enable enhanced functionality and personalization, such as remembering your preferences.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">3. How We Use Cookies</h2>
            <p className="text-muted-foreground mb-4">We use cookies to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Understand and save user preferences</li>
              <li>Keep track of your session</li>
              <li>Compile aggregate data about site traffic and interactions</li>
              <li>Enhance and personalize your experience</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">4. Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">Most web browsers allow you to control cookies through their settings preferences. However, if you limit or block cookies, you may not be able to use all the features of our service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">5. Third-Party Cookies</h2>
            <p className="text-muted-foreground">We may use third-party services that use cookies. These services have their own privacy policies and cookie policies that govern their use of information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">If you have questions about our Cookie Policy, please contact us at support@rezume.dev</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
