"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import {
  setupDatabaseTriggers,
  setupProductRatingFunction,
  setupRLS,
  insertInitialData,
} from "@/app/actions/database-setup"
import { useToast } from "@/components/ui/use-toast"

export default function DatabaseSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<{
    triggers: boolean | null
    ratingFunction: boolean | null
    rls: boolean | null
    initialData: boolean | null
    error: string | null
  }>({
    triggers: null,
    ratingFunction: null,
    rls: null,
    initialData: null,
    error: null,
  })
  const { toast } = useToast()

  const runSetup = async () => {
    setIsLoading(true)
    setStatus({
      triggers: null,
      ratingFunction: null,
      rls: null,
      initialData: null,
      error: null,
    })

    try {
      // Step 1: Setup triggers
      const triggersResult = await setupDatabaseTriggers()
      setStatus((prev) => ({ ...prev, triggers: triggersResult.success }))

      if (!triggersResult.success) {
        setStatus((prev) => ({ ...prev, error: triggersResult.error || "Failed to setup triggers" }))
        return
      }

      // Step 2: Setup product rating function
      const ratingFunctionResult = await setupProductRatingFunction()
      setStatus((prev) => ({ ...prev, ratingFunction: ratingFunctionResult.success }))

      if (!ratingFunctionResult.success) {
        setStatus((prev) => ({
          ...prev,
          error: ratingFunctionResult.error || "Failed to setup product rating function",
        }))
        return
      }

      // Step 3: Setup RLS
      const rlsResult = await setupRLS()
      setStatus((prev) => ({ ...prev, rls: rlsResult.success }))

      if (!rlsResult.success) {
        setStatus((prev) => ({ ...prev, error: rlsResult.error || "Failed to setup RLS policies" }))
        return
      }

      // Step 4: Insert initial data
      const initialDataResult = await insertInitialData()
      setStatus((prev) => ({ ...prev, initialData: initialDataResult.success }))

      if (!initialDataResult.success) {
        setStatus((prev) => ({ ...prev, error: initialDataResult.error || "Failed to insert initial data" }))
        return
      }

      toast({
        title: "Database setup complete",
        description: "All database components have been set up successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Setup error:", error)
      setStatus((prev) => ({ ...prev, error: "An unexpected error occurred during setup" }))

      toast({
        title: "Setup failed",
        description: "An error occurred during database setup.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Database Setup</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Complete Database Setup</CardTitle>
          <CardDescription>Set up database triggers, functions, RLS policies, and insert initial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Your database tables have been created successfully. Now you need to set up the following components:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Database triggers for automatic timestamp updates</li>
              <li>Product rating function to calculate average ratings</li>
              <li>Row Level Security (RLS) policies for data protection</li>
              <li>Initial data including categories, sample products, and store settings</li>
            </ul>

            {status.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 mt-4">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4">
                  {status.triggers === null ? (
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                  ) : status.triggers ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span>Database Triggers</span>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-4 w-4">
                  {status.ratingFunction === null ? (
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                  ) : status.ratingFunction ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span>Product Rating Function</span>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-4 w-4">
                  {status.rls === null ? (
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                  ) : status.rls ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span>Row Level Security Policies</span>
              </div>

              <div className="flex items-center">
                <div className="mr-2 h-4 w-4">
                  {status.initialData === null ? (
                    <span className="inline-block h-4 w-4 rounded-full bg-gray-200"></span>
                  ) : status.initialData ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span>Initial Data</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runSetup} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up Database...
              </>
            ) : (
              "Run Complete Setup"
            )}
          </Button>
        </CardFooter>
      </Card>

      {status.triggers && status.ratingFunction && status.rls && status.initialData && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Setup Complete</AlertTitle>
          <AlertDescription>
            Your database has been successfully set up. You can now start using your e-commerce application.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
