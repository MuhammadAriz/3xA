import { supabase, isSupabaseConfigured } from "./supabase"
import type { User } from "@/contexts/auth-context"

export const AuthService = {
  // Register a new user
  register: async (
    email: string,
    password: string,
    userData: Partial<User>,
  ): Promise<{ user: User | null; error: string | null }> => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured")
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error("Registration error:", authError)
        return { user: null, error: authError.message }
      }

      if (!authData.user) {
        return { user: null, error: "User registration failed" }
      }

      // Create a record in our custom users table
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: email,
          username: userData.username || email.split("@")[0],
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          role: "customer", // Default role
        },
      ])

      if (userError) {
        console.error("User record creation error:", userError)
        return { user: null, error: userError.message }
      }

      // Return the user
      const user: User = {
        id: authData.user.id,
        username: userData.username || email.split("@")[0],
        email: email,
        role: "customer",
      }

      return { user, error: null }
    } catch (error) {
      console.error("Registration failed:", error)
      return {
        user: null,
        error: error instanceof Error ? error.message : "Registration failed",
      }
    }
  },

  // Login
  login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      // For development, allow hardcoded admin login
      if (email === "admin" && password === "password") {
        const user: User = {
          id: "1",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
        }

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("adminAuthenticated", "true")

        return { user, error: null }
      }

      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured")
      }

      // Sign in with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.includes("@") ? email : `${email}@example.com`,
        password,
      })

      if (authError) {
        console.error("Login error:", authError)
        return { user: null, error: authError.message }
      }

      if (!data.user) {
        return { user: null, error: "Login failed" }
      }

      // Get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError) {
        // If user doesn't exist in our custom table, create it
        if (userError.code === "PGRST116") {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email || "",
              username: data.user.email ? data.user.email.split("@")[0] : "user",
              role: "customer",
            },
          ])

          if (insertError) {
            console.error("User record creation error:", insertError)
            return { user: null, error: insertError.message }
          }

          // Return basic user info
          const user: User = {
            id: data.user.id,
            username: data.user.email ? data.user.email.split("@")[0] : "user",
            email: data.user.email || "",
            role: "customer",
          }

          return { user, error: null }
        }

        console.error("User data fetch error:", userError)
        return { user: null, error: userError.message }
      }

      // Return the user
      const user: User = {
        id: userData.id,
        username: userData.username || userData.email.split("@")[0],
        email: userData.email,
        role: userData.role,
      }

      return { user, error: null }
    } catch (error) {
      console.error("Login failed:", error)
      return {
        user: null,
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Check localStorage first for development
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }

      if (!isSupabaseConfigured || !supabase) {
        return null
      }

      // Get session from Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData.session) {
        return null
      }

      // Get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single()

      if (userError || !userData) {
        return null
      }

      return {
        id: userData.id,
        username: userData.username || userData.email.split("@")[0],
        email: userData.email,
        role: userData.role,
      }
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut()
      }

      // Always clear localStorage
      localStorage.removeItem("user")
      localStorage.removeItem("adminAuthenticated")
    } catch (error) {
      console.error("Logout failed:", error)
      throw new Error("Logout failed")
    }
  },

  // Create admin user (for development)
  createAdminUser: async (email: string, password: string): Promise<{ success: boolean; error: string | null }> => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured")
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error("Admin creation error:", authError)
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: "Admin creation failed" }
      }

      // Create a record in our custom users table with admin role
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          email: email,
          username: email.split("@")[0],
          role: "admin",
        },
      ])

      if (userError) {
        console.error("Admin record creation error:", userError)
        return { success: false, error: userError.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error("Admin creation failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Admin creation failed",
      }
    }
  },
}
