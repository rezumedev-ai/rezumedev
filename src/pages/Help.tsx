
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Search, HelpCircle, Info, BookOpen, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I create my first resume?",
    answer: "To create your first resume, click the 'Create New' button on your dashboard. Our step-by-step builder will guide you through the process of adding your personal information, work experience, education, and skills."
  },
  {
    question: "Can I download my resume in different formats?",
    answer: "Yes, you can download your resume in PDF, DOCX, and TXT formats. After completing your resume, click the 'Download' button and select your preferred format."
  },
  {
    question: "How can I customize my resume template?",
    answer: "You can customize your resume template by selecting different themes, fonts, and colors. Use the 'Customize' tab in the resume builder to access these options."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All your information is encrypted and stored securely. We never share your personal data with third parties without your consent."
  },
  {
    question: "Can I create multiple resumes?",
    answer: "Yes, you can create multiple resumes with your account. This is useful for tailoring your resume to different job applications or industries."
  }
];

export default function Help() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={`${isMobile ? 'mt-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div className="animate-fade-up">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                Help & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Support</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Find answers to common questions and get support</p>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: '100ms' }}>
              <Search className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              <Input
                className="pl-10 text-sm md:text-base"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Quick Start Guide</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">1.</span>
                        <span>Sign up for an account or log in if you already have one.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">2.</span>
                        <span>From your dashboard, click "Create New Resume" to start the resume builder.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">3.</span>
                        <span>Follow the step-by-step process to add your personal information, work experience, education, and skills.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">4.</span>
                        <span>Choose a template that best showcases your qualifications.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">5.</span>
                        <span>Preview your resume and make any necessary edits.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">6.</span>
                        <span>Download your completed resume in your preferred format.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Common Resume Mistakes</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Generic objectives</strong>: Use a specific professional summary tailored to each job application.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Typos and grammatical errors</strong>: Always proofread carefully or ask someone else to review.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Including irrelevant experience</strong>: Focus on skills and experience relevant to the job you're applying for.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Poor formatting</strong>: Use consistent spacing, fonts, and design elements throughout.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Too lengthy</strong>: Keep your resume to 1-2 pages maximum, focusing on the most important information.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">•</span>
                        <span><strong>Not using action verbs</strong>: Start bullet points with strong action verbs to showcase your accomplishments.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">Contact Support</h3>
                    <p className="text-gray-600 mb-4">We're here to help! Reach out through any of these channels:</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-gray-500">support@rezume.dev</p>
                          <p className="text-sm text-gray-500">Response within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                          <p className="text-sm text-gray-500">Monday-Friday, 9am-5pm EST</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4 md:space-y-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-4 py-4 text-sm md:text-base hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm md:text-base text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No results found. Try a different search term.
                  </div>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
