
import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      question: "What is an ATS-friendly resume?",
      answer: "An ATS-friendly resume is designed to be easily read by Applicant Tracking Systems (ATS) that 98% of Fortune 500 companies use to screen resumes. These systems scan for specific keywords, proper formatting, and clear section headers. Our AI resume builder automatically creates ATS-optimized resumes with the right keywords, clean formatting, and industry-standard sections to ensure your resume passes through ATS filters and reaches hiring managers.",
    },
    {
      question: "How do I create an ATS-friendly resume?",
      answer: "To create an ATS-friendly resume, use standard section headers (Work Experience, Education, Skills), include relevant keywords from the job description, avoid complex graphics or tables, and use a clean, simple format. Our AI resume builder automatically handles all these requirements, analyzing job descriptions to suggest the right keywords and formatting your resume to meet ATS standards while maintaining visual appeal.",
    },
    {
      question: "What are the best resume templates for 2024?",
      answer: "The best resume templates for 2024 focus on clean, modern designs with clear hierarchy and ATS compatibility. Popular styles include minimalist single-column layouts, professional two-column designs, and creative templates for design roles. Our platform offers 20+ professional resume templates that are both visually appealing and ATS-friendly, updated regularly to match current hiring trends and employer preferences.",
    },
    {
      question: "Can I download my resume for free?",
      answer: "Yes! Rezume.dev offers free resume downloads in PDF format. You can create, customize, and download professional resumes without any cost. Our free plan includes access to multiple templates, basic customization options, and unlimited downloads. Premium features like advanced AI suggestions and premium templates are available for users who want additional functionality.",
    },
    {
      question: "How long should my resume be?",
      answer: "For most professionals, a one-page resume is ideal, especially for those with less than 10 years of experience. Senior professionals with extensive experience may use two pages, but never exceed two pages unless you're in academia or research. Our AI resume builder automatically optimizes content length, helping you prioritize the most relevant information while maintaining the appropriate length for your experience level.",
    },
    {
      question: "What should I include in my professional summary?",
      answer: "A professional summary should be 3-4 lines highlighting your years of experience, key skills, and main achievements. Include industry-specific keywords, quantifiable results, and your career focus. For example: 'Marketing professional with 5+ years driving 40% revenue growth through digital campaigns and data-driven strategies.' Our AI analyzes your background to create compelling, keyword-rich professional summaries tailored to your target roles.",
    },
    {
      question: "How do I tailor my resume for specific jobs?",
      answer: "Tailor your resume by analyzing the job description for keywords, required skills, and qualifications, then adjusting your professional summary, skills section, and work experience descriptions to match. Use the same terminology as the job posting and highlight relevant achievements. Our AI resume builder can analyze job descriptions and automatically suggest content modifications to improve your match rate with specific positions.",
    },
    {
      question: "What resume format do employers prefer?",
      answer: "Employers prefer chronological resume format (most recent experience first) as it's easy to scan and shows career progression clearly. This format works for 90% of job seekers. Functional or combination formats may be used for career changers or those with employment gaps. Our platform defaults to the chronological format while offering flexibility to adjust based on your unique situation and industry requirements.",
    },
    {
      question: "How can I make my resume stand out?",
      answer: "Make your resume stand out by quantifying achievements (increased sales by 25%), using action verbs, including relevant keywords, and maintaining clean formatting. Add a compelling professional summary and ensure your contact information is prominent. Our AI resume builder helps you identify impactful metrics, suggests powerful action verbs, and optimizes formatting to create resumes that catch recruiters' attention while passing ATS screening.",
    },
    {
      question: "Is Rezume.dev completely free to use?",
      answer: "Yes, Rezume.dev offers a robust free plan that includes resume creation, basic templates, and PDF downloads. You can build professional, ATS-friendly resumes without paying anything. We also offer premium features like advanced AI suggestions, exclusive templates, and enhanced customization options for users who want additional functionality to further optimize their job search success.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-accent sm:py-24 lg:py-32 px-4 md:px-6">
      <div className="container">
        <h2 className="mb-8 md:mb-16 text-2xl md:text-3xl font-bold text-center text-secondary sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="p-4 md:p-6 transition-all bg-white rounded-xl md:rounded-2xl hover:shadow-lg group"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="text-base md:text-lg font-semibold text-secondary pr-4">
                  {faq.question}
                </span>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
