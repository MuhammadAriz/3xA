"use client"

import { useState, useEffect } from "react"
import { checkStorageStatus } from "@/app/actions/storage-setup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function StorageSetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const result = await checkStorageStatus()
        setNeedsSetup(!result.success)
      } catch (error) {
        console.error("Error checking storage setup:", error)
        setNeedsSetup(true)
      }
    }

    checkSetup()
  }, [])

  if (needsSetup) {
    return (
      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p>
            Storage setup is required for image uploads. Please follow the{" "}
            <Link href="/admin/debug" className="font-medium underline">
              storage setup guide
            </Link>
            .
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Setup Guide</CardTitle>
        <CardDescription>
          Follow these steps to set up storage for product images in your Supabase project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to create a storage bucket in your Supabase project to store product images. This guide will help
            you set it up.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="ui">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ui">Using Supabase Dashboard</TabsTrigger>
            <TabsTrigger value="sql">Using SQL</TabsTrigger>
          </TabsList>

          <TabsContent value="ui" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Step 1: Go to Storage in Supabase Dashboard</h3>
              <p className="text-sm text-gray-500">
                Open your Supabase project dashboard and navigate to the Storage section in the left sidebar.
              </p>
              <div className="rounded-md bg-gray-50 p-4">
                <Link
                  href="https://app.supabase.com/project/_/storage/buckets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Open Supabase Storage <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Step 2: Create a New Bucket</h3>
              <p className="text-sm text-gray-500">
                Click the "Create a new bucket" button and enter the following details:
              </p>
              <div className="rounded-md bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-sm">Bucket name: product-images</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("product-images", "bucket-name")}
                    className="h-8 px-2"
                  >
                    {copied === "bucket-name" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Make sure to use exactly this name as it's referenced in the code.
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Step 3: Set Bucket Permissions</h3>
              <p className="text-sm text-gray-500">
                For this demo, we'll make the bucket public. In a production environment, you might want to set more
                restrictive permissions.
              </p>
              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-sm">
                  ✓ Make bucket public (anyone can read files, but only authenticated users can upload)
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Step 4: Set RLS Policies</h3>
              <p className="text-sm text-gray-500">
                After creating the bucket, click on it and go to the "Policies" tab to set Row Level Security policies.
              </p>
              <div className="rounded-md bg-gray-50 p-4 space-y-4">
                <div>
                  <p className="font-medium text-sm">For SELECT (read) operations:</p>
                  <div className="mt-1 bg-gray-100 p-2 rounded">
                    <p className="font-mono text-xs">Policy name: Allow public read access</p>
                    <p className="font-mono text-xs">Definition: true</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-sm">For INSERT (upload) operations:</p>
                  <div className="mt-1 bg-gray-100 p-2 rounded">
                    <p className="font-mono text-xs">Policy name: Allow authenticated uploads</p>
                    <p className="font-mono text-xs">Definition: auth.role() = 'authenticated'</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sql" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Create Bucket and Set Policies with SQL</h3>
              <p className="text-sm text-gray-500">
                You can run the following SQL in the Supabase SQL Editor to create the bucket and set up policies:
              </p>
              <div className="relative rounded-md bg-gray-900 p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);`,
                      "sql",
                    )
                  }
                  className="absolute right-2 top-2 h-8 px-2 text-white hover:bg-gray-800"
                >
                  {copied === "sql" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <pre className="overflow-x-auto text-xs text-white">
                  {`-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies

-- Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);`}
                </pre>
              </div>
              <div className="rounded-md bg-gray-50 p-4">
                <Link
                  href="https://app.supabase.com/project/_/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Open Supabase SQL Editor <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <p>
              If you don't want to set up storage right now, you can still use the application with direct image URLs or
              base64 encoded images.
            </p>
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button asChild>
            <Link href="/admin/products">Return to Products</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
