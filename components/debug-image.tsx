"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function DebugImage() {
  const [imageUrl, setImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const testImage = async (url: string) => {
    if (!url) {
      setError("Please enter an image URL")
      return
    }

    setIsLoading(true)
    setError(null)
    setImageLoaded(false)

    try {
      // Create a new Image object to test loading
      const img = new Image()
      img.crossOrigin = "anonymous" // Try with CORS enabled

      // Set up promise to handle image loading
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(true)
        img.onerror = () => reject(new Error("Failed to load image"))
      })

      // Start loading the image
      img.src = url

      // Wait for image to load or fail
      await loadPromise
      setImageLoaded(true)
    } catch (err) {
      console.error("Image loading error:", err)
      setError("Failed to load image. The URL might be invalid or the server doesn't allow cross-origin requests.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Reset states when URL changes
    setError(null)
    setImageLoaded(false)
  }, [imageUrl])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Debug Tool</CardTitle>
        <CardDescription>Test if an image URL can be loaded in the browser</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <Button onClick={() => testImage(imageUrl)} disabled={isLoading}>
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              Test
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {imageUrl && (
          <div className="rounded-md border p-4">
            <p className="mb-2 text-sm font-medium">Preview:</p>
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100">
              {imageUrl && (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Test image"
                  fill
                  className="object-contain"
                  onError={() => {
                    setError("Failed to load image")
                    setImageLoaded(false)
                  }}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              {!imageLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-500">Loading image...</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">Troubleshooting tips:</p>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            <li>Make sure the URL starts with http:// or https://</li>
            <li>Check if the image server allows cross-origin requests (CORS)</li>
            <li>Verify that the file extension matches the actual image format</li>
            <li>Try using a different image hosting service if problems persist</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">
          Status: {imageLoaded ? "✅ Image loaded successfully" : error ? "❌ Failed to load" : "Waiting for test"}
        </p>
      </CardFooter>
    </Card>
  )
}
