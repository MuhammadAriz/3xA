"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { checkSupabaseConnection, isSupabaseConfigured } from "@/lib/supabase"

export default function SupabaseStatusChecker() {
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<{
    configured: boolean
    connected: boolean | null
    error: string | null
  }>({
    configured: isSupabaseConfigured,
    connected: null,
    error: null,
  })

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const result = await checkSupabaseConnection()
      setStatus({
        configured: isSupabaseConfigured,
        connected: result.success,
        error: result.success ? null : result.error || "Unknown error",
      })
    } catch (error) {
      setStatus({
        configured: isSupabaseConfigured,
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check connection on mount
    checkConnection()
  }, [])

  if (status.configured && status.connected) {
    return null // Don't show anything if everything is working
  }

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-amber-800">Supabase Connection Status</CardTitle>
        <CardDescription>Check the status of your Supabase connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4">
              {status.configured ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <span>Supabase Configuration: {status.configured ? "Configured" : "Not Configured"}</span>
          </div>

          <div className="flex items-center">
            <div className="mr-2 h-4 w-4">
              {status.connected === null ? (
                <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
              ) : status.connected ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <span>
              Supabase Connection:{" "}
              {status.connected === null ? "Checking..." : status.connected ? "Connected" : "Connection Failed"}
            </span>
          </div>

          {status.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{status.error}</AlertDescription>
            </Alert>
          )}

          {!status.configured && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Missing</AlertTitle>
              <AlertDescription>
                Supabase environment variables are not configured. The application will use local storage as a fallback.
              </AlertDescription>
            </Alert>
          )}

          {status.configured && !status.connected && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                There seems to be an issue connecting to Supabase. This could be due to:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                <li>Network connectivity issues</li>
                <li>Incorrect Supabase URL or API key</li>
                <li>Supabase service might be temporarily unavailable</li>
                <li>CORS issues in development environment</li>
              </ul>
              <p className="text-sm text-gray-600">
                The application will use local storage as a fallback until the connection is restored.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={isChecking} variant="outline" className="w-full">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking Connection...
            </>
          ) : (
            "Check Connection Again"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
