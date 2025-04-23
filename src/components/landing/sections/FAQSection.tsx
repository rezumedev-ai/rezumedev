
import React from 'react';
import { FAQItem } from '../ui/FAQItem';
import { SectionContainer } from '../ui/SectionContainer';

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

export const FAQSection = () => {
  return (
    <SectionContainer className="py-12 md:py-20 bg-accent sm:py-24 lg:py-32 px-4 md:px-6">
      <div className="container">
        <h2 className="mb-8 md:mb-16 text-2xl md:text-3xl font-bold text-center text-secondary sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq) => (
            <FAQItem 
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
