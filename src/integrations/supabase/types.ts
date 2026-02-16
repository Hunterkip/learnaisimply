export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      payment_settings: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_enabled: boolean
          payment_method: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          payment_method: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_enabled?: boolean
          payment_method?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          account_reference: string
          amount: number
          checkout_request_id: string | null
          created_at: string
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          payment_method: string
          paypal_transaction_id: string | null
          phone_number: string | null
          plan: string | null
          result_desc: string | null
          status: string
          transaction_date: string | null
          updated_at: string
        }
        Insert: {
          account_reference: string
          amount: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_method: string
          paypal_transaction_id?: string | null
          phone_number?: string | null
          plan?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          updated_at?: string
        }
        Update: {
          account_reference?: string
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_method?: string
          paypal_transaction_id?: string | null
          phone_number?: string | null
          plan?: string | null
          result_desc?: string | null
          status?: string
          transaction_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          consumed_at: string | null
          consumed_by_user: string | null
          created_at: string
          customer_email: string | null
          id: string
          reference: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          consumed_at?: string | null
          consumed_by_user?: string | null
          created_at?: string
          customer_email?: string | null
          id?: string
          reference: string
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          consumed_at?: string | null
          consumed_by_user?: string | null
          created_at?: string
          customer_email?: string | null
          id?: string
          reference?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_provider: string | null
          avatar_url: string | null
          created_at: string
          email: string
          email_verified_at: string | null
          first_name: string | null
          has_access: boolean
          id: string
          last_name: string | null
          plan: string | null
        }
        Insert: {
          auth_provider?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          email_verified_at?: string | null
          first_name?: string | null
          has_access?: boolean
          id: string
          last_name?: string | null
          plan?: string | null
        }
        Update: {
          auth_provider?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          email_verified_at?: string | null
          first_name?: string | null
          has_access?: boolean
          id?: string
          last_name?: string | null
          plan?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_amount: number
          discount_percentage: number
          discounted_amount: number
          email: string
          expires_at: string
          id: string
          original_amount: number
          status: string
          thank_you_message: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          code?: string
          created_at?: string
          discount_amount?: number
          discount_percentage?: number
          discounted_amount?: number
          email: string
          expires_at: string
          id?: string
          original_amount?: number
          status?: string
          thank_you_message?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_amount?: number
          discount_percentage?: number
          discounted_amount?: number
          email?: string
          expires_at?: string
          id?: string
          original_amount?: number
          status?: string
          thank_you_message?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quiz_leads: {
        Row: {
          comfort_level: number | null
          created_at: string
          current_ai_usage: string | null
          email: string
          hours_to_save: number | null
          id: string
          name: string
          profession: string | null
          readiness_level: string | null
          readiness_score: number | null
          repetitive_task: string | null
          status: string
          values_certificate: boolean | null
        }
        Insert: {
          comfort_level?: number | null
          created_at?: string
          current_ai_usage?: string | null
          email: string
          hours_to_save?: number | null
          id?: string
          name: string
          profession?: string | null
          readiness_level?: string | null
          readiness_score?: number | null
          repetitive_task?: string | null
          status?: string
          values_certificate?: boolean | null
        }
        Update: {
          comfort_level?: number | null
          created_at?: string
          current_ai_usage?: string | null
          email?: string
          hours_to_save?: number | null
          id?: string
          name?: string
          profession?: string | null
          readiness_level?: string | null
          readiness_score?: number | null
          repetitive_task?: string | null
          status?: string
          values_certificate?: boolean | null
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          course_id: string
          granted_at: string
          granted_by_payment_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          granted_at?: string
          granted_by_payment_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          granted_at?: string
          granted_by_payment_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          notified: boolean | null
          notified_at: string | null
          signed_up_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          notified?: boolean | null
          notified_at?: string | null
          signed_up_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          notified?: boolean | null
          notified_at?: string | null
          signed_up_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      custom_password_check: { Args: { input_data: Json }; Returns: Json }
      generate_promo_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_grant_payment: {
        Args: { p_payment_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
