"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { isSupabaseConfigured, useSupabaseClient } from "@/lib/supabase"

export type User = {
  id: string
  username: string
  email: string
  role: "admin" | "user"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = useSupabaseClient()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await checkAuth()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }

    checkAuthentication()
  }, [])

  // This function will check authentication with Supabase or localStorage
  const checkAuth = async (): Promise<boolean> => {
    try {
      // Try to check with Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (session) {
          // Get user details from our users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (userError) {
            throw userError
          }

          const user = {
            id: userData.id,
            username: userData.email.split("@")[0],
            email: userData.email,
            role: userData.role,
          }

          setUser(user)
          return true
        }
      }

      // Fallback to localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Auth check failed:", error)

      // Fallback to localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        return true
      }
      return false
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Try to login with Supabase if configured
      if (isSupabaseConfigured && supabase) {
        // For development, allow hardcoded admin login
        if (username === "admin" && password === "password") {
          const user: User = {
            id: "1",
            username: "admin",
            email: "admin@example.com",
            role: "admin",
          }

          localStorage.setItem("user", JSON.stringify(user))
          localStorage.setItem("adminAuthenticated", "true")

          setUser(user)
          setIsAuthenticated(true)
          return true
        }

        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.includes("@") ? username : `${username}@example.com`,
          password,
        })

        if (error) {
          throw error
        }

        // Get user details from our users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (userError) {
          throw userError
        }

        const user = {
          id: userData.id,
          username: userData.email.split("@")[0],
          email: userData.email,
          role: userData.role,
        }

        setUser(user)
        setIsAuthenticated(true)
        return true
      }

      // Fallback to hardcoded credentials
      if (username === "admin" && password === "password") {
        const user: User = {
          id: "1",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
        }

        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("adminAuthenticated", "true")

        setUser(user)
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Try to logout from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(console.error)
    }

    // Always clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("adminAuthenticated")

    setUser(null)
    setIsAuthenticated(false)

    // Redirect to login page
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
