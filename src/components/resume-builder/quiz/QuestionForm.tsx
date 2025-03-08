
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
      className="space-y-6"
    >
      <motion.h2 
        className="text-3xl font-bold text-gray-900 mb-8"
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
      >
        {question.inputType === "textarea" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            className="text-lg p-6 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300 min-h-[200px]"
          />
        ) : (
          <Input
            type={question.inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            className="text-lg p-6 border-2 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
        )}
        {question.required && (
          <p className="text-sm text-gray-500 mt-2">* Required field</p>
        )}
      </motion.div>
    </motion.div>
  );
}
