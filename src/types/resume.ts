
export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrentJob?: boolean;
  responsibilities: string[];
  achievements?: string[]; // Adding achievements separate from responsibilities
}

export interface Education {
  degreeName: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  isCurrentlyEnrolled?: boolean;
}

export interface Certification {
  name: string;
  organization: string;
  completionDate: string;
}

export interface ResumeData {
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  professional_summary: {
    title: string;
    summary: string;
    targetRole?: string; // Adding target role for better context
    industryKeywords?: string[]; // Adding industry keywords for ATS optimization
  };
  work_experience: WorkExperience[];
  education: Education[];
  skills: {
    hard_skills: string[];
    soft_skills: string[];
    industry_specific?: string[]; // Adding industry-specific skills
  };
  certifications: Certification[];
  template_id?: string;
  ats_keywords?: string[]; // Track ATS keywords used throughout the resume
}
