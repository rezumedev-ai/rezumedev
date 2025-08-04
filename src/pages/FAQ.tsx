import { Helmet } from 'react-helmet';
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "What makes a resume ATS-friendly in 2024?",
      answer: "An ATS-friendly resume uses standard formatting, includes relevant keywords from the job description, uses common section headings like 'Work Experience' and 'Education,' avoids complex graphics or tables, and is saved in a compatible format like .docx or .pdf. Our AI analyzes job descriptions and optimizes your resume to pass through Applicant Tracking Systems used by 99% of Fortune 500 companies."
    },
    {
      question: "Are your resume templates compatible with Applicant Tracking Systems?",
      answer: "Yes, all our resume templates are specifically designed to be ATS-compatible. We test each template with popular ATS software like Workday, Greenhouse, and Lever to ensure proper parsing. Our templates use clean formatting, standard fonts, and proper heading structures that ATS systems can easily read and categorize."
    },
    {
      question: "How many resume templates do you offer for 2024?",
      answer: "We offer over 20 professionally designed resume templates for 2024, covering various industries and career levels. Our collection includes modern, classic, creative, and executive templates. Each template is regularly updated to reflect current hiring trends and ATS requirements."
    },
    {
      question: "What's the difference between free and premium resume templates?",
      answer: "Free templates provide basic formatting and standard sections, while premium templates offer advanced customization options, multiple color schemes, enhanced layouts, priority customer support, and access to our AI-powered content suggestions. Premium users also get unlimited downloads and revisions."
    },
    {
      question: "How does AI help improve my resume content?",
      answer: "Our AI analyzes your job experience and the target job description to suggest powerful action verbs, quantify achievements, optimize keyword density, and restructure bullet points for maximum impact. The AI also identifies gaps in your resume and suggests relevant skills or experiences to highlight based on industry standards."
    },
    {
      question: "Can I customize resume templates to match my industry?",
      answer: "Absolutely! Our templates are designed with industry-specific customization in mind. You can adjust colors, fonts, section layouts, and content structure to match your field - whether you're in tech, healthcare, finance, creative industries, or any other sector. Each template includes industry-specific examples and suggestions."
    },
    {
      question: "How do I make my resume stand out to hiring managers?",
      answer: "Focus on quantifiable achievements, use strong action verbs, tailor your resume to each job application, include relevant keywords, maintain clean formatting, and highlight your unique value proposition. Our platform provides specific recommendations for your industry and experience level to help your resume stand out in competitive job markets."
    },
    {
      question: "What resume format is best for my career level?",
      answer: "For entry-level positions, use a functional or combination format highlighting skills and education. Mid-level professionals should use a chronological format emphasizing career progression. Senior executives benefit from a hybrid format showcasing leadership achievements. Our AI recommends the optimal format based on your experience and target role."
    },
    {
      question: "How often should I update my resume?",
      answer: "Update your resume every 6-12 months or whenever you gain new skills, complete significant projects, receive promotions, or change career goals. Regular updates ensure your resume reflects current achievements and industry trends. Our platform saves your progress automatically, making updates quick and effortless."
    },
    {
      question: "Do you offer customer support for resume creation?",
      answer: "Yes, we provide comprehensive customer support including live chat, email support, detailed tutorials, and a knowledge base. Premium users receive priority support with faster response times. Our support team includes career coaching experts who can provide personalized advice for your specific situation."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Rezume.dev - Resume Builder FAQ</title>
        <meta name="description" content="Find answers to common questions about our AI-powered resume builder, ATS-friendly templates, pricing, and features. Get help creating professional resumes that land interviews." />
        <meta name="keywords" content="resume builder FAQ, ATS-friendly resume questions, resume template help, AI resume builder support, professional resume FAQ, job application help, resume formatting questions" />
        <meta name="author" content="Rezume.dev" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://rezume.dev/faq" />
        <link rel="icon" type="image/x-icon" href="/custom-favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/custom-favicon.svg" />
        <link rel="shortcut icon" href="/custom-favicon.ico" />
        <link rel="apple-touch-icon" href="/custom-favicon.ico" />
        <meta name="theme-color" content="#9B87F5" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rezume.dev/faq" />
        <meta property="og:title" content="Frequently Asked Questions | Rezume.dev - Resume Builder FAQ" />
        <meta property="og:description" content="Find answers to common questions about our AI-powered resume builder, ATS-friendly templates, and features." />
        <meta property="og:image" content="https://rezume.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Rezume.dev" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rezumedev" />
        <meta name="twitter:title" content="Frequently Asked Questions | Rezume.dev" />
        <meta name="twitter:description" content="Find answers to common questions about our AI-powered resume builder." />
        <meta name="twitter:image" content="https://rezume.dev/og-image.png" />
        
        {/* FAQ structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${faqs.map(faq => `{
                  "@type": "Question",
                  "name": "${faq.question}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${faq.answer.replace(/"/g, '\\"')}"
                  }
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 relative animate-fade-up">
                <span className="text-secondary">Frequently Asked </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Questions
                </span>
                <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-primary via-accent to-primary/60 animate-pulse"></div>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '100ms' }}>
                Find answers to common questions about our resume builder
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3"
                />
              </div>
            </div>

            {/* FAQ List */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                {filteredFaqs.map((faq, index) => (
                  <details key={index} className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer list-none items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                      <h3 className="text-lg font-semibold text-secondary pr-4">{faq.question}</h3>
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 animate-fade-up">
                  <p className="text-muted-foreground text-lg">No FAQs found matching your search.</p>
                  <p className="text-muted-foreground mt-2">Try a different search term or browse all questions above.</p>
                </div>
              )}
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-2xl font-bold text-secondary mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/help"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors"
                >
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FAQ;