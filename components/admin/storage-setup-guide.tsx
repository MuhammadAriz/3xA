"use client"

import { useState, useEffect } from "react"
import { checkStorageStatus } from "@/app/actions/storage-setup"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, AlertTriangle } from "lucide-react"

export default function StorageSetupGuide() {
  const [status, setStatus] = useState<{
    checked: boolean
    success: boolean
    message: string
  }>({
    checked: false,
    success: false,
    message: "Checking storage configuration...",
  })

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const result = await checkStorageStatus()
        setStatus({
          checked: true,
          success: result.success,
          message:
            result.message ||
            (result.success ? "Storage is properly configured." : "Storage configuration issue detected."),
        })
      } catch (error) {
        setStatus({
          checked: true,
          success: false,
          message: "Error checking storage configuration.",
        })
      }
    }

    checkStorage()
  }, [])

  // If storage is configured correctly, don't show anything
  if (status.success) {
    return null
  }

  // Only show the guide if there's an issue
  return (
    <div className="mb-8">
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Storage Configuration</AlertTitle>
        <AlertDescription>{status.message}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Storage Setup Instructions</CardTitle>
          <CardDescription>Follow these steps to set up storage for product images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">1. Go to your Supabase Dashboard</h3>
            <p className="text-sm text-gray-500">Log in to your Supabase account and select your project.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">2. Navigate to Storage</h3>
            <p className="text-sm text-gray-500">In the left sidebar, click on "Storage".</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">3. Create a New Bucket</h3>
            <p className="text-sm text-gray-500">Click "Create a new bucket" and name it exactly "product-images".</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">4. Make the Bucket Public</h3>
            <p className="text-sm text-gray-500">
              Set the bucket to public by enabling "Public bucket" in the bucket settings.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">5. Set RLS Policies</h3>
            <p className="text-sm text-gray-500">
              Create policies that allow anyone to read files and authenticated users to upload files.
            </p>
          </div>

          <div className="mt-4 rounded-md bg-amber-50 p-4 text-amber-800">
            <h4 className="flex items-center text-sm font-medium">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alternative: Use Direct Image URLs
            </h4>
            <p className="mt-1 text-sm">
              If you prefer not to set up Supabase Storage, you can use direct image URLs from external sources when
              adding products.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <a
              href="https://supabase.com/docs/guides/storage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              Supabase Storage Documentation
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
