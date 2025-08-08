export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          cookie_id: string
          created_at: string | null
          id: string
          link_id: string
          referrer: string | null
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          cookie_id: string
          created_at?: string | null
          id?: string
          link_id: string
          referrer?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          cookie_id?: string
          created_at?: string | null
          id?: string
          link_id?: string
          referrer?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_conversions: {
        Row: {
          amount: number | null
          click_id: string
          commission_amount: number | null
          conversion_type: string
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          click_id: string
          commission_amount?: number | null
          conversion_type: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          click_id?: string
          commission_amount?: number | null
          conversion_type?: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_conversions_click_id_fkey"
            columns: ["click_id"]
            isOneToOne: false
            referencedRelation: "affiliate_clicks"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_id: string
          code: string
          created_at: string | null
          id: string
          name: string
          target_url: string
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          code: string
          created_at?: string | null
          id?: string
          name: string
          target_url: string
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          target_url?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_links_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payments: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string | null
          id: string
          payment_details: Json | null
          payment_method: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string | null
          id?: string
          payment_details?: Json | null
          payment_method?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payments_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          balance: number | null
          commission_rate: number | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          payment_details: Json | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          commission_rate?: number | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          payment_details?: Json | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          commission_rate?: number | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          payment_details?: Json | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
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
          linkedin_url: string | null
          payment_method: string | null
          phone: string | null
          resume_preferences: Json | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          desktop_notifications?: boolean | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          linkedin_url?: string | null
          payment_method?: string | null
          phone?: string | null
          resume_preferences?: Json | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          desktop_notifications?: boolean | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          linkedin_url?: string | null
          payment_method?: string | null
          phone?: string | null
          resume_preferences?: Json | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          website_url?: string | null
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
      redemption_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_redeemed: boolean
          redeemed_at: string | null
          redeemed_by: string | null
          source: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
          source?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
          source?: string | null
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
      resume_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_default: boolean
          name: string
          personal_info: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          personal_info?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          personal_info?: Json
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      quiz_question_type: [
        "personal_info",
        "work_experience",
        "education",
        "certification",
      ],
    },
  },
} as const
