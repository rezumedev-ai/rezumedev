
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Search, HelpCircle, Info, BookOpen, Mail } from "lucide-react";
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
    answer: "Click 'Create New' on your dashboard and follow our step-by-step builder to add your information, experience, education, and skills."
  },
  {
    question: "How can I customize my resume template?",
    answer: "Use the 'Customize' tab in the resume builder to select different themes, fonts, and colors for your resume."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, all your information is encrypted and stored securely. We never share your personal data with third parties."
  },
  {
    question: "Can I create multiple resumes?",
    answer: "Yes, you can create multiple resumes with your account to tailor for different job applications or industries."
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
        <div className="p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-5 md:space-y-6">
            <div className="animate-fade-up">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Help & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Support</span>
              </h1>
              <p className="text-gray-600 text-sm md:text-base">Find answers to common questions</p>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: '100ms' }}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 text-sm py-2"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <Card className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-2">Quick Start Guide</h3>
                    <ul className="space-y-1.5 text-gray-600 text-sm">
                      <li className="flex items-start gap-1.5">
                        <span className="font-medium text-primary">1.</span>
                        <span>Sign up or log in to your account</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-medium text-primary">2.</span>
                        <span>Click "Create New Resume" on your dashboard</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-medium text-primary">3.</span>
                        <span>Add your personal info, work experience, education, and skills</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-medium text-primary">4.</span>
                        <span>Choose a template and preview your resume</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-medium text-primary">5.</span>
                        <span>Download in your preferred format</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-2">Common Resume Mistakes</h3>
                    <ul className="space-y-1.5 text-gray-600 text-sm">
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary font-medium">•</span>
                        <span><strong>Generic objectives</strong>: Use a specific professional summary</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary font-medium">•</span>
                        <span><strong>Typos</strong>: Always proofread carefully</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary font-medium">•</span>
                        <span><strong>Irrelevant experience</strong>: Focus on job-relevant skills</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary font-medium">•</span>
                        <span><strong>Poor formatting</strong>: Use consistent design elements</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary font-medium">•</span>
                        <span><strong>Too lengthy</strong>: Keep to 1-2 pages maximum</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm mb-2">We're here to help! Reach out by email:</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">support@rezume.dev</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-3 md:space-y-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-lg md:text-xl font-semibold">Frequently Asked Questions</h2>
              <Accordion 
                type="single" 
                collapsible 
                className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm"
              >
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 text-sm text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
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
