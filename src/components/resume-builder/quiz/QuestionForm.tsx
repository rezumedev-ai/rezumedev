
import { Question } from "./types";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionFormProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export function QuestionForm({ question, value, onChange }: QuestionFormProps) {
  if (question.inputType === "select" && question.options) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{question.text}</h2>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={question.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-[400px]">
              {question.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="space-y-4 py-2">
                    {option.imageUrl && (
                      <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                        <img
                          src={option.imageUrl}
                          alt={option.label}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500">{option.description}</div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{question.text}</h2>
      <Input
        type={question.inputType}
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={question.required}
        className={cn(
          "w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-primary",
          question.required ? "border-gray-300" : "border-gray-200"
        )}
      />
    </motion.div>
  );
}
