import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a flag to check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create a singleton pattern for the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Create the Supabase client only if environment variables are available
export const supabase = isSupabaseConfigured
  ? (() => {
      if (!supabaseInstance) {
        try {
          supabaseInstance = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
            },
            global: {
              fetch: (...args) => {
                return fetch(...args)
              },
            },
          })
          console.log("Supabase client initialized successfully")
        } catch (error) {
          console.error("Failed to initialize Supabase client:", error)
          return null
        }
      }
      return supabaseInstance
    })()
  : null

// Helper function to safely use Supabase
export function useSupabaseClient() {
  if (!isSupabaseConfigured) {
    console.warn("Supabase is not configured. Using localStorage fallback.")
    return null
  }

  if (!supabase) {
    console.error("Supabase client initialization failed. Using localStorage fallback.")
    return null
  }

  return supabase
}

// Debug function to check Supabase connection
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
