
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

const helpfulLinks = [
  {
    title: "Quick Start Guide",
    description: "Get started with our platform in just a few minutes",
    icon: BookOpen,
    link: "/dashboard"
  },
  {
    title: "Common Resume Mistakes",
    description: "Avoid these common pitfalls when creating your resume",
    icon: Info,
    link: "/dashboard"
  },
  {
    title: "Contact Support",
    description: "Need more help? Reach out to our support team",
    icon: HelpCircle,
    link: "/contact"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
              {helpfulLinks.map((link, index) => (
                <Card key={index} className="p-4 md:p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <link.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">{link.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{link.description}</p>
                    <Button variant="ghost" asChild className="mt-1 md:mt-2 text-xs md:text-sm px-2 py-1 h-auto">
                      <a href={link.link}>View Details</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4 md:space-y-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="px-3 md:px-4 py-3 text-sm md:text-base hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 md:px-4 text-xs md:text-sm text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-4 md:space-y-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-xl md:text-2xl font-semibold">Need More Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Email Support</h3>
                      <p className="text-xs md:text-sm text-gray-600">support@rezume.dev</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 md:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Phone Support</h3>
                      <p className="text-xs md:text-sm text-gray-600">Mon-Fri, 9am-5pm EST</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
