import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Simple environment variable checks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Export the Supabase client
export const supabase = isSupabaseConfigured
  ? (() => {
      if (!supabaseInstance) {
        try {
          supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
        } catch (error) {
          console.error("Failed to initialize Supabase client:", error)
          return null
        }
      }
      return supabaseInstance
    })()
  : null

// Helper function for React components
export function useSupabaseClient() {
  return supabase
}

// Debug function
export async function checkSupabaseConnection() {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" }
  }

  try {
    const { data, error } = await supabase.from("products").select("count").limit(1)
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
