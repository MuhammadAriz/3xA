"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function DebugImage() {
  const [imageUrl, setImageUrl] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testImage = async () => {
    if (!imageUrl) return

    setIsLoading(true)
    setTestResult(null)

    try {
      // Test if the image can be loaded
      const img = new Image()

      const imageLoadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = imageUrl
      })

      await imageLoadPromise

      setTestResult({
        success: true,
        message: "Image loaded successfully!",
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: `Failed to load image: ${error instanceof Error ? error.message : String(error)}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Image Debug Tool</CardTitle>
        <CardDescription>Test if an image URL can be loaded correctly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}

          {imageUrl && testResult?.success && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Preview:</p>
              <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Test image"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testImage} disabled={!imageUrl || isLoading}>
          {isLoading ? "Testing..." : "Test Image"}
        </Button>
      </CardFooter>
    </Card>
  )
}
