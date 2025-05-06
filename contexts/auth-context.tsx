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
        return false
      }

      if (user) {
        setUser(user)
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      setError(error instanceof Error ? error.message : "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)

      const { user, error } = await AuthService.register(email, password, userData)

      if (error) {
        setError(error)
        return false
      }

      if (user) {
        setUser(user)
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.error("Registration failed:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
      return false
    } finally {
      setIsLoading(false)
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
