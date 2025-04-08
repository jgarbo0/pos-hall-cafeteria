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
      appearance_settings: {
        Row: {
          animations: boolean | null
          compact_mode: boolean | null
          created_at: string
          font_size: string | null
          id: string
          primary_color: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          animations?: boolean | null
          compact_mode?: boolean | null
          created_at?: string
          font_size?: string | null
          id?: string
          primary_color?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          animations?: boolean | null
          compact_mode?: boolean | null
          created_at?: string
          font_size?: string | null
          id?: string
          primary_color?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      hall_bookings: {
        Row: {
          additional_services: string[] | null
          attendees: number
          created_at: string
          customer_name: string
          customer_phone: string
          date: string
          discount: number | null
          discount_type: string | null
          end_time: string
          hall_id: number | null
          id: string
          notes: string | null
          package_id: string | null
          purpose: string
          start_time: string
          status: string
          table_id: string | null
          total_amount: number
        }
        Insert: {
          additional_services?: string[] | null
          attendees: number
          created_at?: string
          customer_name: string
          customer_phone: string
          date: string
          discount?: number | null
          discount_type?: string | null
          end_time: string
          hall_id?: number | null
          id?: string
          notes?: string | null
          package_id?: string | null
          purpose: string
          start_time: string
          status: string
          table_id?: string | null
          total_amount: number
        }
        Update: {
          additional_services?: string[] | null
          attendees?: number
          created_at?: string
          customer_name?: string
          customer_phone?: string
          date?: string
          discount?: number | null
          discount_type?: string | null
          end_time?: string
          hall_id?: number | null
          id?: string
          notes?: string | null
          package_id?: string | null
          purpose?: string
          start_time?: string
          status?: string
          table_id?: string | null
          total_amount?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          min_stock_level: number | null
          name: string
          purchase_price: number
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          min_stock_level?: number | null
          name: string
          purchase_price: number
          quantity?: number
          supplier?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          min_stock_level?: number | null
          name?: string
          purchase_price?: number
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          id: string
          inventory_item_id: string
          notes: string | null
          quantity: number
          total_price: number | null
          transaction_date: string
          transaction_type: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_item_id: string
          notes?: string | null
          quantity: number
          total_price?: number | null
          transaction_date?: string
          transaction_type: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          inventory_item_id?: string
          notes?: string | null
          quantity?: number
          total_price?: number | null
          transaction_date?: string
          transaction_type?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_inventory_item"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_count: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_count?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_count?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          available: number
          category_id: string
          created_at: string
          description: string | null
          id: string
          image: string | null
          popular: boolean | null
          price: number
          title: string
        }
        Insert: {
          available?: number
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          popular?: boolean | null
          price: number
          title: string
        }
        Update: {
          available?: number
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          popular?: boolean | null
          price?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_menu_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          app_inventory: boolean | null
          app_new_order: boolean | null
          app_order_status: boolean | null
          created_at: string
          email_customer_feedback: boolean | null
          email_daily_summary: boolean | null
          email_low_stock: boolean | null
          email_new_order: boolean | null
          id: string
          updated_at: string
        }
        Insert: {
          app_inventory?: boolean | null
          app_new_order?: boolean | null
          app_order_status?: boolean | null
          created_at?: string
          email_customer_feedback?: boolean | null
          email_daily_summary?: boolean | null
          email_low_stock?: boolean | null
          email_new_order?: boolean | null
          id?: string
          updated_at?: string
        }
        Update: {
          app_inventory?: boolean | null
          app_new_order?: boolean | null
          app_order_status?: boolean | null
          created_at?: string
          email_customer_feedback?: boolean | null
          email_daily_summary?: boolean | null
          email_low_stock?: boolean | null
          email_new_order?: boolean | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          discount: number | null
          id: string
          menu_item_id: string
          notes: string | null
          order_id: string
          price: number
          quantity: number
          spicy_level: number | null
        }
        Insert: {
          discount?: number | null
          id?: string
          menu_item_id: string
          notes?: string | null
          order_id: string
          price: number
          quantity: number
          spicy_level?: number | null
        }
        Update: {
          discount?: number | null
          id?: string
          menu_item_id?: string
          notes?: string | null
          order_id?: string
          price?: number
          quantity?: number
          spicy_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_menu_item"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_name: string | null
          discount: number | null
          discount_type: string | null
          id: string
          order_number: string
          order_type: string
          payment_status: string | null
          status: string
          subtotal: number
          table_number: number | null
          tax: number
          timestamp: string
          total: number
        }
        Insert: {
          customer_name?: string | null
          discount?: number | null
          discount_type?: string | null
          id?: string
          order_number: string
          order_type: string
          payment_status?: string | null
          status: string
          subtotal: number
          table_number?: number | null
          tax: number
          timestamp?: string
          total: number
        }
        Update: {
          customer_name?: string | null
          discount?: number | null
          discount_type?: string | null
          id?: string
          order_number?: string
          order_type?: string
          payment_status?: string | null
          status?: string
          subtotal?: number
          table_number?: number | null
          tax?: number
          timestamp?: string
          total?: number
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          actions: string[]
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
          updated_at: string
        }
        Insert: {
          actions: string[]
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
          updated_at?: string
        }
        Update: {
          actions?: string[]
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      receipt_settings: {
        Row: {
          address: string | null
          created_at: string
          footer: string | null
          header: string | null
          id: string
          include_tip: boolean | null
          show_logo: boolean | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          footer?: string | null
          header?: string | null
          id?: string
          include_tip?: boolean | null
          show_logo?: boolean | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          footer?: string | null
          header?: string | null
          id?: string
          include_tip?: boolean | null
          show_logo?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_info: {
        Row: {
          address: string | null
          business_hours: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          seats: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          seats?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          seats?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_permission"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_role"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          items: string[]
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          items?: string[]
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          items?: string[]
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          category: string
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      staff_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      tax_settings: {
        Row: {
          created_at: string
          id: string
          include_tax_in_price: boolean | null
          show_tax_on_receipt: boolean | null
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          include_tax_in_price?: boolean | null
          show_tax_on_receipt?: boolean | null
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          include_tax_in_price?: boolean | null
          show_tax_on_receipt?: boolean | null
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          payment_method: string | null
          reference: string | null
          type: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          payment_method?: string | null
          reference?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          payment_method?: string | null
          reference?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_table_export: {
        Args: { tablename: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
