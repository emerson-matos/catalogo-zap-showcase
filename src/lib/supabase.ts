import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG } from "./config";

if (!APP_CONFIG.supabase.url || !APP_CONFIG.supabase.anonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
  APP_CONFIG.supabase.url,
  APP_CONFIG.supabase.anonKey,
);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id?: string;
          rating?: number;
          is_new?: boolean;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category_id?: string;
          rating?: number;
          is_new?: boolean;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category_id?: string;
          rating?: number;
          is_new?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          color?: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string;
          description?: string;
          color?: string;
          is_active?: boolean;
          sort_order?: number;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          color?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: "admin" | "editor" | "viewer";
          created_at: string;
          updated_at: string;
        };
      };
      // Note: Using Supabase Auth native invite system instead of custom table
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate =
  Database["public"]["Tables"]["categories"]["Update"];
