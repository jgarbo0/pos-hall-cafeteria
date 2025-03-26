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
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
          id: string
          menu_item_id: string
          notes: string | null
          order_id: string
          price: number
          quantity: number
          spicy_level: number | null
        }
        Insert: {
          id?: string
          menu_item_id: string
          notes?: string | null
          order_id: string
          price: number
          quantity: number
          spicy_level?: number | null
        }
        Update: {
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
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
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
            foreignKeyName: "roles_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roles_permissions_role_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
