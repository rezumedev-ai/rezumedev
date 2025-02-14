
import { ResumeData } from "@/types/resume";

export interface Question {
  id: string;
  text: string;
  type: string;
  field: string;
  required: boolean;
  placeholder: string;
  inputType: string;
}

export interface QuizStep {
  type: string;
  title: string;
  icon: JSX.Element;
}

export interface QuizFormData extends ResumeData {
  currentStep: number;
}

export interface QuestionFormProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}
