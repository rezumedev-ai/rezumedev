export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_suggestions: {
        Row: {
          created_at: string
          id: string
          priority: string
          resume_id: string
          section: string
          suggestion: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: string
          resume_id: string
          section: string
          suggestion: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: string
          resume_id?: string
          section?: string
          suggestion?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      cover_letters: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          application_date: string | null
          company_name: string
          created_at: string
          id: string
          job_title: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date?: string | null
          company_name: string
          created_at?: string
          id?: string
          job_title: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string | null
          company_name?: string
          created_at?: string
          id?: string
          job_title?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          desktop_notifications: boolean | null
          email: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          payment_method: string | null
          resume_preferences: Json | null
          subscription_id: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          desktop_notifications?: boolean | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          payment_method?: string | null
          resume_preferences?: Json | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          desktop_notifications?: boolean | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          payment_method?: string | null
          resume_preferences?: Json | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          order_index: number
          question_key: string
          question_text: string
          question_type: Database["public"]["Enums"]["quiz_question_type"]
          required: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          question_key: string
          question_text: string
          question_type: Database["public"]["Enums"]["quiz_question_type"]
          required?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          question_key?: string
          question_text?: string
          question_type?: Database["public"]["Enums"]["quiz_question_type"]
          required?: boolean | null
        }
        Relationships: []
      }
      resume_content: {
        Row: {
          certifications: Json[]
          created_at: string
          education: Json[]
          id: string
          personal_info: Json
          professional_summary: Json
          skills: Json
          updated_at: string
          user_id: string | null
          work_experience: Json[]
        }
        Insert: {
          certifications?: Json[]
          created_at?: string
          education?: Json[]
          id?: string
          personal_info?: Json
          professional_summary?: Json
          skills?: Json
          updated_at?: string
          user_id?: string | null
          work_experience?: Json[]
        }
        Update: {
          certifications?: Json[]
          created_at?: string
          education?: Json[]
          id?: string
          personal_info?: Json
          professional_summary?: Json
          skills?: Json
          updated_at?: string
          user_id?: string | null
          work_experience?: Json[]
        }
        Relationships: []
      }
      resume_quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          question_key: string
          response: Json | null
          resume_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_key: string
          response?: Json | null
          resume_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_key?: string
          response?: Json | null
          resume_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_quiz_responses_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          order_index: number | null
          resume_id: string | null
          section_type: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          resume_id?: string | null
          section_type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          resume_id?: string | null
          section_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_sections_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          certifications: Json[] | null
          completion_status: string | null
          content: Json
          created_at: string
          current_step: number | null
          downloads: number | null
          education: Json[] | null
          id: string
          personal_info: Json | null
          professional_summary: Json | null
          profile_image_url: string | null
          skills: Json | null
          style_preference: string | null
          template_id: string | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
          work_experience: Json[] | null
        }
        Insert: {
          certifications?: Json[] | null
          completion_status?: string | null
          content?: Json
          created_at?: string
          current_step?: number | null
          downloads?: number | null
          education?: Json[] | null
          id?: string
          personal_info?: Json | null
          professional_summary?: Json | null
          profile_image_url?: string | null
          skills?: Json | null
          style_preference?: string | null
          template_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
          work_experience?: Json[] | null
        }
        Update: {
          certifications?: Json[] | null
          completion_status?: string | null
          content?: Json
          created_at?: string
          current_step?: number | null
          downloads?: number | null
          education?: Json[] | null
          id?: string
          personal_info?: Json | null
          professional_summary?: Json | null
          profile_image_url?: string | null
          skills?: Json | null
          style_preference?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
          work_experience?: Json[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      quiz_question_type:
        | "personal_info"
        | "work_experience"
        | "education"
        | "certification"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
