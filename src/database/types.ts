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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      todo_instances: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          description_override: string | null
          due_at: string | null
          id: string
          source_date: string | null
          status: Database["public"]["Enums"]["todo_status"]
          title_override: string | null
          todo_id: string
          updated_at: string
          user_id: string
          visible_from: string | null
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          description_override?: string | null
          due_at?: string | null
          id?: string
          source_date?: string | null
          status?: Database["public"]["Enums"]["todo_status"]
          title_override?: string | null
          todo_id: string
          updated_at?: string
          user_id: string
          visible_from?: string | null
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          description_override?: string | null
          due_at?: string | null
          id?: string
          source_date?: string | null
          status?: Database["public"]["Enums"]["todo_status"]
          title_override?: string | null
          todo_id?: string
          updated_at?: string
          user_id?: string
          visible_from?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todo_instances_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
      todo_recurrence_rules: {
        Row: {
          by_monthdays: number[] | null
          by_months: number[] | null
          by_weekdays: number[] | null
          created_at: string
          due_time: string | null
          ends_on: string | null
          freq: Database["public"]["Enums"]["recurrence_freq"]
          id: string
          interval_count: number
          last_generated_until: string | null
          max_occurrences: number | null
          starts_on: string
          todo_id: string
          updated_at: string
          visible_days_before: number
        }
        Insert: {
          by_monthdays?: number[] | null
          by_months?: number[] | null
          by_weekdays?: number[] | null
          created_at?: string
          due_time?: string | null
          ends_on?: string | null
          freq: Database["public"]["Enums"]["recurrence_freq"]
          id?: string
          interval_count?: number
          last_generated_until?: string | null
          max_occurrences?: number | null
          starts_on: string
          todo_id: string
          updated_at?: string
          visible_days_before?: number
        }
        Update: {
          by_monthdays?: number[] | null
          by_months?: number[] | null
          by_weekdays?: number[] | null
          created_at?: string
          due_time?: string | null
          ends_on?: string | null
          freq?: Database["public"]["Enums"]["recurrence_freq"]
          id?: string
          interval_count?: number
          last_generated_until?: string | null
          max_occurrences?: number | null
          starts_on?: string
          todo_id?: string
          updated_at?: string
          visible_days_before?: number
        }
        Relationships: [
          {
            foreignKeyName: "todo_recurrence_rules_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: true
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          archived: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          kind: Database["public"]["Enums"]["todo_kind"]
          list_id: string | null
          notes: string | null
          parent_todo_id: string | null
          priority: number
          status: Database["public"]["Enums"]["todo_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["todo_kind"]
          list_id?: string | null
          notes?: string | null
          parent_todo_id?: string | null
          priority?: number
          status?: Database["public"]["Enums"]["todo_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["todo_kind"]
          list_id?: string | null
          notes?: string | null
          parent_todo_id?: string | null
          priority?: number
          status?: Database["public"]["Enums"]["todo_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_parent_todo_id_fkey"
            columns: ["parent_todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_actionable_todo_instances: {
        Row: {
          archived: boolean | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_at: string | null
          id: string | null
          kind: Database["public"]["Enums"]["todo_kind"] | null
          notes: string | null
          priority: number | null
          source_date: string | null
          status: Database["public"]["Enums"]["todo_status"] | null
          title: string | null
          todo_id: string | null
          updated_at: string | null
          user_id: string | null
          visible_from: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todo_instances_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_scheduled_todo: {
        Args: {
          p_description?: string
          p_due_at?: string
          p_notes?: string
          p_priority?: number
          p_title: string
          p_visible_from: string
        }
        Returns: string
      }
      create_simple_todo: {
        Args: {
          p_description?: string
          p_due_at?: string
          p_notes?: string
          p_priority?: number
          p_title: string
          p_visible_from?: string
        }
        Returns: string
      }
      create_weekly_recurring_todo: {
        Args: {
          p_by_weekdays: number[]
          p_description?: string
          p_due_time?: string
          p_generate_days_ahead?: number
          p_notes?: string
          p_priority?: number
          p_starts_on: string
          p_title: string
          p_visible_days_before?: number
        }
        Returns: string
      }
      generate_weekly_todo_instances: {
        Args: { p_from: string; p_to: string; p_todo_id: string }
        Returns: number
      }
    }
    Enums: {
      recurrence_freq: "daily" | "weekly" | "monthly" | "yearly"
      todo_kind: "simple" | "scheduled" | "recurring"
      todo_status: "pending" | "done" | "cancelled"
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
      recurrence_freq: ["daily", "weekly", "monthly", "yearly"],
      todo_kind: ["simple", "scheduled", "recurring"],
      todo_status: ["pending", "done", "cancelled"],
    },
  },
} as const
