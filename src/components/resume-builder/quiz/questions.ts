
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
    text: "Share your LinkedIn profile URL (Optional)",
    type: "personal_info",
    field: "linkedin",
    required: false,
    placeholder: "https://linkedin.com/in/johndoe",
    inputType: "url"
  },
  {
    id: "website",
    text: "Do you have a portfolio website? (Optional)",
    type: "personal_info",
    field: "website",
    required: false,
    placeholder: "https://johndoe.com",
    inputType: "url"
  },
  {
    id: "targetRole",
    text: "What's your target job title?",
    type: "professional_summary",
    field: "title",
    required: true,
    placeholder: "e.g. Senior Software Engineer",
    inputType: "text"
  },
  {
    id: "currentIndustry",
    text: "What industry are you currently working in?",
    type: "professional_summary",
    field: "industry",
    required: true,
    placeholder: "e.g. Technology, Healthcare, Finance",
    inputType: "text"
  },
  {
    id: "yearsOfExperience",
    text: "How many years of relevant experience do you have in this field?",
    type: "professional_summary",
    field: "experience",
    required: true,
    placeholder: "e.g. 5",
    inputType: "number"
  },
  {
    id: "keyAchievement",
    text: "What's your most significant professional achievement?",
    type: "professional_summary",
    field: "achievement",
    required: true,
    placeholder: "e.g. Led a team that increased revenue by 50%",
    inputType: "text"
  }
];
