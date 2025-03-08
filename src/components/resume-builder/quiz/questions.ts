
import { Question } from "./types";

export const questions: Question[] = [
  {
    id: "fullName",
    text: "What's your full name?",
    type: "personal_info",
    field: "fullName",
    required: true,
    placeholder: "John Doe",
    inputType: "text"
  },
  {
    id: "email",
    text: "What's your email address?",
    type: "personal_info",
    field: "email",
    required: true,
    placeholder: "john@example.com",
    inputType: "email"
  },
  {
    id: "phone",
    text: "What's your phone number?",
    type: "personal_info",
    field: "phone",
    required: true,
    placeholder: "+1 (555) 000-0000",
    inputType: "tel"
  },
  {
    id: "linkedin",
    text: "Share your LinkedIn profile URL",
    type: "personal_info",
    field: "linkedin",
    required: false,
    placeholder: "https://linkedin.com/in/johndoe",
    inputType: "url"
  },
  {
    id: "website",
    text: "Do you have a portfolio website?",
    type: "personal_info",
    field: "website",
    required: false,
    placeholder: "https://johndoe.com",
    inputType: "url"
  },
  {
    id: "jobTitle",
    text: "What's your desired job title?",
    type: "professional_summary",
    field: "title",
    required: true,
    placeholder: "e.g. Senior Software Engineer",
    inputType: "text"
  },
  {
    id: "jobDescription",
    text: "Do you have a job description you'd like to target? (Optional)",
    type: "professional_summary",
    field: "targetJobDescription",
    required: false,
    placeholder: "Paste the complete job description here to tailor your resume",
    inputType: "textarea"
  }
];
