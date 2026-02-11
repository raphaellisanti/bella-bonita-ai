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
      appointments: {
        Row: {
          client_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          professional_id: string
          salon_id: string
          service_id: string
          start_time: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          professional_id: string
          salon_id: string
          service_id: string
          start_time: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          professional_id?: string
          salon_id?: string
          service_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          birth_date: string | null
          churn_probability: number | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_visit: string | null
          notes: string | null
          phone: string | null
          salon_id: string
          total_visits: number | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          churn_probability?: number | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          last_visit?: string | null
          notes?: string | null
          phone?: string | null
          salon_id: string
          total_visits?: number | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          churn_probability?: number | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_visit?: string | null
          notes?: string | null
          phone?: string | null
          salon_id?: string
          total_visits?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_triggers: {
        Row: {
          ai_reasoning: string | null
          channel: string | null
          client_id: string
          created_at: string
          id: string
          message: string | null
          salon_id: string
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["trigger_status"]
          trigger_type: string
        }
        Insert: {
          ai_reasoning?: string | null
          channel?: string | null
          client_id: string
          created_at?: string
          id?: string
          message?: string | null
          salon_id: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["trigger_status"]
          trigger_type: string
        }
        Update: {
          ai_reasoning?: string | null
          channel?: string | null
          client_id?: string
          created_at?: string
          id?: string
          message?: string | null
          salon_id?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["trigger_status"]
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_triggers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_triggers_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          cost_per_unit: number | null
          created_at: string
          id: string
          min_stock_alert: number | null
          name: string
          salon_id: string
          stock_quantity: number
          unit: Database["public"]["Enums"]["unit_type"]
          updated_at: string
        }
        Insert: {
          brand?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          min_stock_alert?: number | null
          name: string
          salon_id: string
          stock_quantity?: number
          unit?: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
        }
        Update: {
          brand?: string | null
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          min_stock_alert?: number | null
          name?: string
          salon_id?: string
          stock_quantity?: number
          unit?: Database["public"]["Enums"]["unit_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salon_members: {
        Row: {
          commission_rate: number | null
          created_at: string
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          salon_id: string
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          salon_id: string
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          salon_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_members_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_recipes: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity_used: number
          service_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity_used?: number
          service_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity_used?: number
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_recipes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_recipes_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          salon_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          price?: number
          salon_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          salon_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          appointment_id: string | null
          commission_amount: number | null
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          professional_id: string | null
          salon_amount: number | null
          salon_id: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          commission_amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          professional_id?: string | null
          salon_amount?: number | null
          salon_id: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          commission_amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          professional_id?: string | null
          salon_amount?: number | null
          salon_id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_salon_member: {
        Args: { _salon_id: string; _user_id: string }
        Returns: boolean
      }
      is_salon_owner: {
        Args: { _salon_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "staff"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      transaction_type: "revenue" | "commission" | "expense" | "refund"
      trigger_status: "pending" | "sent" | "failed" | "cancelled"
      unit_type: "ml" | "g" | "un"
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
      app_role: ["owner", "staff"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      transaction_type: ["revenue", "commission", "expense", "refund"],
      trigger_status: ["pending", "sent", "failed", "cancelled"],
      unit_type: ["ml", "g", "un"],
    },
  },
} as const
