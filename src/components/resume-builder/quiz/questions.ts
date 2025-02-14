
import { Question } from "./types";
import { resumeTemplates } from "../templates";

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
    id: "template",
    text: "Choose a resume template that best matches your style",
    type: "template",
    field: "template_id",
    required: true,
    placeholder: "Select a template",
    inputType: "select",
    options: resumeTemplates.map(template => ({
      value: template.id,
      label: template.name,
      description: template.description,
      imageUrl: template.imageUrl
    }))
  },
  {
    id: "jobTitle",
    text: "What's your desired job title?",
    type: "professional_summary",
    field: "title",
    required: true,
    placeholder: "e.g. Senior Software Engineer",
    inputType: "text"
  }
];
