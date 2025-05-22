
export interface ResumeProfile {
  id: string;
  user_id: string;
  name: string;
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  avatar_url?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResumeProfileParams {
  name: string;
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    website?: string;
  };
  avatar_url?: string;
  is_default?: boolean;
}

export interface UpdateResumeProfileParams {
  name?: string;
  personal_info?: {
    fullName?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    website?: string;
  };
  avatar_url?: string | null;
  is_default?: boolean;
}
