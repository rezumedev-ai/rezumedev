
import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const faqs = [
    {
      question: "How does the AI resume builder work?",
      answer: "Our AI analyzes your input and industry standards to create a professionally formatted resume with optimized content that passes ATS systems.",
    },
    {
      question: "Can I customize the generated resume?",
      answer: "Yes, you can edit any part of your resume after AI generation to add personal touches or specific details.",
    },
    {
      question: "Is my information secure?",
      answer: "We use enterprise-grade encryption to protect your data. Your information is never shared with third parties.",
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
