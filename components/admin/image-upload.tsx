"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, LinkIcon } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploadProps {
  initialImage?: string | null
  onImageChange: (imageUrl: string | null) => void
}

export default function ImageUpload({ initialImage, onImageChange }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [directUrl, setDirectUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset preview when initialImage changes
  useEffect(() => {
    // Skip blob URLs as they're temporary
    if (initialImage && !initialImage.startsWith("blob:")) {
      setImage(initialImage)

      // If it's a URL, set the direct URL field
      if (initialImage.startsWith("http")) {
        setDirectUrl(initialImage)
        setActiveTab("url")
      }
    } else {
      setImage(null)
    }
    setPreviewUrl(null)
  }, [initialImage])

  // Convert a file to a data URL (base64)
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Always convert to data URL first as a fallback
      const dataUrl = await fileToDataUrl(file)
      setPreviewUrl(dataUrl)

      // Use the data URL as initial value
      setImage(dataUrl)
      onImageChange(dataUrl)

      // Try to upload to Supabase if available
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.log("Supabase configuration missing, using data URL")
        return
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${fileName}`

      // Try to upload to product-images bucket
      try {
        const { data, error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        })

        if (uploadError) {
          // If bucket doesn't exist or other error, log it and continue with data URL
          console.error("Upload error:", uploadError)
          return
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

        if (publicUrlData?.publicUrl) {
          console.log("Uploaded image URL:", publicUrlData.publicUrl)
          setImage(publicUrlData.publicUrl)
          onImageChange(publicUrlData.publicUrl)
        }
      } catch (uploadError) {
        console.error("Error uploading to Supabase:", uploadError)
        // Continue with data URL
      }
    } catch (error) {
      console.error("Error handling file:", error)
      setError("Failed to process image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirectUrl(e.target.value)
  }

  const handleDirectUrlSubmit = () => {
    if (!directUrl.trim()) {
      setError("Please enter an image URL")
      return
    }

    if (!directUrl.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://")
      return
    }

    setError(null)
    setImage(directUrl)
    onImageChange(directUrl)
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
    setDirectUrl("")
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Determine which image to display (uploaded image, preview, or placeholder)
  const displayImage = image || previewUrl

  // Don't use blob URLs as they're temporary
  const imageToDisplay =
    displayImage && displayImage.startsWith("blob:") ? "/placeholder.svg" : displayImage || "/placeholder.svg"

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="product-image">Product Image</Label>

        {displayImage ? (
          <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md border">
            <Image
              src={imageToDisplay || "/placeholder.svg"}
              alt="Product image"
              fill
              className="object-cover"
              sizes="200px"
              onError={(e) => {
                // If image fails to load, replace with placeholder
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
                console.error("Image failed to load:", displayImage)
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-80 transition-opacity hover:opacity-100"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="url">Direct URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div
                className="flex aspect-square w-full max-w-[200px] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                onClick={handleButtonClick}
              >
                <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>

              <Input
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isUploading}
              />

              <Button
                type="button"
                variant="outline"
                className="w-fit"
                onClick={handleButtonClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </>
                )}
              </Button>
            </TabsContent>
            <TabsContent value="url" className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="direct-url">Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="direct-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={directUrl}
                    onChange={handleDirectUrlChange}
                  />
                  <Button type="button" onClick={handleDirectUrlSubmit}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Use URL
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter a direct URL to an image (must start with http:// or https://)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {image && !image.startsWith("blob:") && !image.startsWith("data:") && (
          <p className="text-xs text-gray-500 break-all">Image URL: {image}</p>
        )}
      </div>
    </div>
  )
}
