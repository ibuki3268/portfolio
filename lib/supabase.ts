import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      portfolio: {
        Row: {
          id: number;
          name: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          id: number;
          name: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      portfolio_abouts: {
        Row: {
          id: number;
          portfolio_id: number;
          content: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          portfolio_id: number;
          content: string;
          sort_order: number;
        };
        Update: {
          id?: number;
          portfolio_id?: number;
          content?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: number;
          portfolio_id: number;
          title: string;
          description: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          portfolio_id: number;
          title: string;
          description: string;
          sort_order: number;
        };
        Update: {
          id?: number;
          portfolio_id?: number;
          title?: string;
          description?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      project_tags: {
        Row: {
          id: number;
          project_id: number;
          tag: string;
          sort_order: number;
        };
        Insert: {
          id?: number;
          project_id: number;
          tag: string;
          sort_order: number;
        };
        Update: {
          id?: number;
          project_id?: number;
          tag?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

type SupabaseServerClient = SupabaseClient<Database>;

let cachedClient: SupabaseServerClient | null = null;

export function getSupabaseServerClient(): SupabaseServerClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  return cachedClient;
}
