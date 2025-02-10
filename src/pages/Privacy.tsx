
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-4xl px-4 py-16 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-secondary">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">Welcome to Rezume.dev. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered resume building service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Professional information for resume creation</li>
              <li>Account credentials</li>
              <li>Payment information when purchasing premium services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the collected information for:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Providing and improving our resume building service</li>
              <li>Generating personalized resumes using AI technology</li>
              <li>Processing your transactions</li>
              <li>Sending you service-related communications</li>
              <li>Analyzing usage patterns to improve our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">We implement appropriate technical and organizational security measures to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">5. Third-Party Services</h2>
            <p className="text-muted-foreground">Our service integrates with third-party services for specific functionalities. These services have their own privacy policies governing their use of your information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground">If you have questions about this Privacy Policy, please contact us at support@rezume.dev</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
