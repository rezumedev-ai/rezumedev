import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
        <h1 className="mb-8 text-4xl font-bold text-secondary">Terms of Service</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">By accessing and using Rezume.dev, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">2. Service Description</h2>
            <p className="text-muted-foreground">Rezume.dev provides an AI-powered resume building service that helps users create professional resumes. We reserve the right to modify or discontinue the service at any time.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">When creating an account, you agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground">The service, including its original content, features, and functionality, is owned by Rezume.dev and is protected by international copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">5. User Content</h2>
            <p className="text-muted-foreground">You retain ownership of the content you submit to create your resume. By using our service, you grant us a license to use this content for providing and improving our services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">Rezume.dev shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">7. Changes to Terms</h2>
            <p className="text-muted-foreground">We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground">For questions about these Terms, please contact us at support@rezume.dev</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
