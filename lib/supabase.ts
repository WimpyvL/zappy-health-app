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
          phone_number: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address: {
            street?: string
            city?: string
            state?: string
            zip_code?: string
            country?: string
          } | null
          emergency_contact: {
            name?: string
            phone?: string
            relationship?: string
          } | null
          medical_info: {
            allergies?: string[]
            medications?: string[]
            conditions?: string[]
            height?: number
            weight?: number
            blood_type?: string
          } | null
          preferences: {
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
              marketing: boolean
            }
            privacy: {
              share_data_for_research: boolean
              share_progress_with_providers: boolean
            }
            communication: {
              preferred_contact_method: 'email' | 'sms' | 'phone' | 'app'
              timezone: string
            }
          } | null
          subscription_status: 'free' | 'premium' | 'enterprise' | null
          subscription_expires_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address?: {
            street?: string
            city?: string
            state?: string
            zip_code?: string
            country?: string
          } | null
          emergency_contact?: {
            name?: string
            phone?: string
            relationship?: string
          } | null
          medical_info?: {
            allergies?: string[]
            medications?: string[]
            conditions?: string[]
            height?: number
            weight?: number
            blood_type?: string
          } | null
          preferences?: {
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
              marketing: boolean
            }
            privacy: {
              share_data_for_research: boolean
              share_progress_with_providers: boolean
            }
            communication: {
              preferred_contact_method: 'email' | 'sms' | 'phone' | 'app'
              timezone: string
            }
          } | null
          subscription_status?: 'free' | 'premium' | 'enterprise' | null
          subscription_expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address?: {
            street?: string
            city?: string
            state?: string
            zip_code?: string
            country?: string
          } | null
          emergency_contact?: {
            name?: string
            phone?: string
            relationship?: string
          } | null
          medical_info?: {
            allergies?: string[]
            medications?: string[]
            conditions?: string[]
            height?: number
            weight?: number
            blood_type?: string
          } | null
          preferences?: {
            notifications: {
              email: boolean
              sms: boolean
              push: boolean
              marketing: boolean
            }
            privacy: {
              share_data_for_research: boolean
              share_progress_with_providers: boolean
            }
            communication: {
              preferred_contact_method: 'email' | 'sms' | 'phone' | 'app'
              timezone: string
            }
          } | null
          subscription_status?: 'free' | 'premium' | 'enterprise' | null
          subscription_expires_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          patient_id: string
          doctor_id: string
          subject: string | null
          status: string
          last_message_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          patient_id: string
          doctor_id: string
          subject?: string | null
          status?: string
          last_message_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          patient_id?: string
          doctor_id?: string
          subject?: string | null
          status?: string
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: string
          metadata: any
          created_at: string
          updated_at: string
          read_at: string | null
          is_edited: boolean
          edited_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: string
          metadata?: any
          created_at?: string
          updated_at?: string
          read_at?: string | null
          is_edited?: boolean
          edited_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: string
          metadata?: any
          created_at?: string
          updated_at?: string
          read_at?: string | null
          is_edited?: boolean
          edited_at?: string | null
        }
      }
      doctors: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          full_name: string
          specialty: string
          license_number: string | null
          avatar_url: string | null
          bio: string | null
          is_active: boolean
          theme_color: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          full_name: string
          specialty: string
          license_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_active?: boolean
          theme_color?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          specialty?: string
          license_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          is_active?: boolean
          theme_color?: string
        }
      }
      message_read_status: {
        Row: {
          id: string
          message_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          message_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          user_id?: string
          read_at?: string
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
      patients: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string | null
          email: string
          date_of_birth: string | null
          weight: number | null
          height: number | null
          target_weight: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name?: string | null
          email: string
          date_of_birth?: string | null
          weight?: number | null
          height?: number | null
          target_weight?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string | null
          email?: string
          date_of_birth?: string | null
          weight?: number | null
          height?: number | null
          target_weight?: number | null
          created_at?: string
          updated_at?: string
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