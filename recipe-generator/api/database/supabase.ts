import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  dietary_preferences?: string[];
  cooking_skill?: "beginner" | "intermediate" | "advanced";
  favorite_cuisines?: string[];
  updated_at: string;
}

export interface UserSession {
  user_id: string;
  email: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

// Helper functions
export async function createUserProfile(userData: Partial<UserProfile>) {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .insert(userData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
) {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
