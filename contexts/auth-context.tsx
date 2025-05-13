"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"

export type User = {
  id: string
  username: string
  email: string
  role: "admin" | "user" | "customer"
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, userData: Partial<User>) => Promise<boolean>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is authenticated on initial load
  useEffect(() => {
    let isMounted = true

    const checkAuthentication = async () => {
      try {
        const authenticated = await checkAuth()

        // Only update state if component is still mounted
        if (isMounted) {
          setIsAuthenticated(authenticated)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuthentication()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [])

  // This function will check authentication with Supabase or localStorage
  const checkAuth = async (): Promise<boolean> => {
    try {
      const user = await AuthService.getCurrentUser()

      if (user) {
        setUser(user)
        return true
      }

      return false
    } catch (error) {
      console.error("Auth check failed:", error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const { user, error } = await AuthService.login(email, password)

      if (error) {
        setError(error)
        setIsLoading(false)
        return false
      }

      if (user) {
        setUser(user)
        setIsAuthenticated(true)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login failed:", error)
      setError(error instanceof Error ? error.message : "Login failed")
      setIsLoading(false)
      return false
    }
  }

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const { user, error } = await AuthService.register(email, password, userData)

      if (error) {
        setError(error)
        setIsLoading(false)
        return false
      }

      if (user) {
        setUser(user)
        setIsAuthenticated(true)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    AuthService.logout()
      .then(() => {
        setUser(null)
        setIsAuthenticated(false)
        router.push("/admin/login")
      })
      .catch(console.error)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin: user?.role === "admin",
        error,
        login,
        logout,
        register,
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
