import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create the Supabase client only if environment variables are available
export const supabase = isSupabaseConfigured ? createClient<Database>(supabaseUrl!, supabaseAnonKey!) : null

// Helper function to safely use Supabase
export function useSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Using localStorage fallback.")
    return null
  }
  return supabase
}
