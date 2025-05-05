"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { isSupabaseConfigured } from "@/lib/supabase"
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function SupabaseSetupGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {isSupabaseConfigured ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Supabase Connected
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Supabase Setup Required
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isSupabaseConfigured
            ? "Your application is connected to Supabase."
            : "Follow these steps to connect your application to Supabase."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured && (
          <>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database Not Connected</AlertTitle>
              <AlertDescription>
                Your application is currently using localStorage for data storage. To enable persistent database
                storage, follow the steps below.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-medium">1. Create a Supabase Project</h3>
                <p className="text-sm text-gray-600">
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  and sign up or log in. Create a new project and note your project URL and anon key.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">2. Set Environment Variables</h3>
                <p className="text-sm text-gray-600">
                  Add these to your <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> file:
                </p>
                <pre className="mt-2 bg-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                  <code>
                    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url{"\n"}
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">3. Run the SQL Script</h3>
                <p className="text-sm text-gray-600">
                  Go to the SQL Editor in your Supabase dashboard and run the SQL script provided in the documentation.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">4. Restart Your Application</h3>
                <p className="text-sm text-gray-600">
                  After setting up the environment variables, restart your application to connect to Supabase.
                </p>
              </div>
            </div>
          </>
        )}

        {isSupabaseConfigured && (
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              <span>Environment variables configured correctly</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              <span>Connected to Supabase project</span>
            </div>
            <Separator className="my-4" />
            <p className="text-sm text-gray-600">
              Your application is now using Supabase for database storage. You can manage your data through the Supabase
              dashboard.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isSupabaseConfigured ? (
          <Button asChild>
            <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
              Go to Supabase <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link
              href="https://app.supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Open Supabase Dashboard <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
