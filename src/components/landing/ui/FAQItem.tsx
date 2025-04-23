
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <details
      className="p-4 md:p-6 transition-all bg-white rounded-xl md:rounded-2xl hover:shadow-lg group"
    >
      <summary className="flex items-center justify-between cursor-pointer">
        <span className="text-base md:text-lg font-semibold text-secondary pr-4">
          {question}
        </span>
        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
        {answer}
      </p>
    </details>
  );
};
