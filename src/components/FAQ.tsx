
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
    <section className="py-20 bg-accent sm:py-32">
      <div className="container">
        <h2 className="mb-16 text-3xl font-bold text-center text-secondary sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="p-6 transition-all bg-white rounded-2xl hover:shadow-lg group"
            >
              <summary className="flex items-center justify-between cursor-pointer">
                <span className="text-lg font-semibold text-secondary">
                  {faq.question}
                </span>
                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
