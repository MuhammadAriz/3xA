"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, register, error: authError, isAuthenticated, isAdmin, checkAuth } = useAuth()

  // Login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Registration state
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [regUsername, setRegUsername] = useState("")
  const [regError, setRegError] = useState("")
  const [regIsLoading, setRegIsLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth()

        // If already authenticated and is admin, redirect to admin dashboard
        if (authenticated && isAdmin) {
          router.push("/admin")
        }
      } catch (error) {
        console.error("Auth verification error:", error)
      }
    }

    verifyAuth()
  }, [isAdmin, router, checkAuth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // First validate credentials before redirecting
      const success = await login(email, password)

      if (success) {
        setLoginSuccess(true)
        // Wait a moment before redirecting to ensure state is updated
        setTimeout(() => {
          router.push("/admin")
        }, 500)
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError("")

    // Validate passwords match
    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match")
      return
    }

    setRegIsLoading(true)

    try {
      const success = await register(regEmail, regPassword, { username: regUsername })
      if (success) {
        setRegSuccess(true)
        // Clear form
        setRegEmail("")
        setRegPassword("")
        setRegConfirmPassword("")
        setRegUsername("")
      }
    } catch (error) {
      setRegError("Registration failed. Please try again.")
      console.error("Registration error:", error)
    } finally {
      setRegIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>Login or register</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              {(error || authError) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error || authError}</AlertDescription>
                </Alert>
              )}

              {loginSuccess && (
                <Alert className="mb-4 bg-green-50">
                  <AlertDescription className="text-green-600">Login successful! Redirecting...</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              {regError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{regError}</AlertDescription>
                </Alert>
              )}

              {regSuccess && (
                <Alert className="mb-4 bg-green-50">
                  <AlertDescription className="text-green-600">
                    Registration successful! You can now log in.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                  <Input
                    id="reg-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" type="submit" disabled={regIsLoading}>
                  {regIsLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">For development, you can use admin/password</p>
        </CardFooter>
      </Card>
    </div>
  )
}
