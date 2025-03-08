
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuestionFormProps } from "./types";
import { motion } from "framer-motion";

export function QuestionForm({ question, value, onChange }: QuestionFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="space-y-4 sm:space-y-6 w-full"
    >
      <motion.h2 
        className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.text}
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        {question.inputType === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            className="text-base sm:text-lg p-3 sm:p-6 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[150px] sm:min-h-[200px] bg-white"
          />
        ) : (
          <Input
            type={question.inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            className="text-base sm:text-lg p-3 sm:p-6 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white"
          />
        )}
        {question.required && (
          <p className="text-sm text-gray-500 mt-2">* Required field</p>
        )}
      </motion.div>
    </motion.div>
  );
}
