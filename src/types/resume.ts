
export interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrentJob?: boolean;
  responsibilities: string[];
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
  };
  work_experience: WorkExperience[];
  education: Education[];
  skills: {
    hard_skills: string[];
    soft_skills: string[];
  };
  certifications: Certification[];
}
