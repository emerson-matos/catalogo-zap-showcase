import { createClient } from '@supabase/supabase-js'
import { APP_CONFIG } from './config'

if (!APP_CONFIG.supabase.url || !APP_CONFIG.supabase.anonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(
  APP_CONFIG.supabase.url,
  APP_CONFIG.supabase.anonKey
)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          category: string
          rating?: number
          is_new?: boolean
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          category: string
          rating?: number
          is_new?: boolean
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          category?: string
          rating?: number
          is_new?: boolean
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          updated_at?: string
        }
      }
      user_invites: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          invited_by: string | null
          token: string
          expires_at: string
          used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'admin' | 'editor' | 'viewer'
          invited_by?: string | null
          token: string
          expires_at: string
          used_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'editor' | 'viewer'
          invited_by?: string | null
          token?: string
          expires_at?: string
          used_at?: string | null
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

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert']
export type UserRoleUpdate = Database['public']['Tables']['user_roles']['Update']
export type UserInvite = Database['public']['Tables']['user_invites']['Row']
export type UserInviteInsert = Database['public']['Tables']['user_invites']['Insert']
export type UserInviteUpdate = Database['public']['Tables']['user_invites']['Update']