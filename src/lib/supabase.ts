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
          image: string;
          category: string;
          rating?: number;
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
          category: string;
          rating?: number;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          rating?: number;
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
        Insert: {
          id?: string;
          user_id: string;
          role: "admin" | "editor" | "viewer";
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "admin" | "editor" | "viewer";
          updated_at?: string;
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
export type UserRoleInsert =
  Database["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate =
  Database["public"]["Tables"]["user_roles"]["Update"];
// Note: Using Supabase Auth native invite system - no custom types needed

