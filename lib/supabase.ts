import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types (you can generate these from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      health_records: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          record_type: string
          data: any
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          record_type: string
          data: any
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          record_type?: string
          data?: any
          notes?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          status: string
          total_amount: number
          items: any
          shipping_address: any | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          status: string
          total_amount: number
          items: any
          shipping_address?: any | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          status?: string
          total_amount?: number
          items?: any
          shipping_address?: any | null
        }
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
  }
}