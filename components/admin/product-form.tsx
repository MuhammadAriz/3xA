"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useProducts } from "@/contexts/product-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LinkIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingOverlay from "@/components/loading-overlay"
import { useSupabaseClient } from "@/lib/supabase"
import ImageUpload from "./image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Helper function to check if a URL is valid
function isValidImageUrl(url: string): boolean {
  // Check if it's a valid URL format
  if (!url) return false

  // Don't use blob URLs as they're temporary and session-specific
  if (url.startsWith("blob:")) return false

  // Allow data URLs (base64 encoded images)
  if (url.startsWith("data:image/")) return true

  // Check if it's a valid HTTP URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
  } catch (e) {
    return false
  }
}

export default function ProductForm() {
  const router = useRouter()
  const params = useParams()
  const { getProductById, addProduct, updateProduct, error: contextError } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const supabase = useSupabaseClient()
  const [activeTab, setActiveTab] = useState<string>("upload")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    categoryId: "",
    rating: "5",
    reviewCount: "0",
    stock: "0",
    featured: false,
    darazLink: "",
    slug: "", // Added slug field
  })

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        if (supabase) {
          const { data, error } = await supabase.from("categories").select("id, name").order("name")

          if (error) throw error

          setCategories(data || [])
        } else {
          // Fallback to mock data if Supabase is not available
          setCategories([
            { id: "1", name: "Electronics" },
            { id: "2", name: "Clothing" },
            { id: "3", name: "Home & Kitchen" },
            { id: "4", name: "Books" },
            { id: "5", name: "Toys & Games" },
          ])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Fallback to mock data
        setCategories([
          { id: "1", name: "Electronics" },
          { id: "2", name: "Clothing" },
          { id: "3", name: "Home & Kitchen" },
          { id: "4", name: "Books" },
          { id: "5", name: "Toys & Games" },
        ])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [supabase])

  useEffect(() => {
    const loadProduct = async () => {
      if (params?.id) {
        setIsLoading(true)
        try {
          const product = await getProductById(params.id as string)
          if (product) {
            // Skip blob URLs as they're temporary
            const imageUrl = product.image && product.image.startsWith("blob:") ? "" : product.image || ""

            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              image: imageUrl,
              category: product.category,
              categoryId: product.categoryId || "",
              rating: product.rating.toString(),
              reviewCount: product.reviewCount.toString(),
              stock: product.stock.toString(),
              featured: product.featured,
              darazLink: product.darazLink || "",
              slug: product.slug || "", // Set slug if available
            })

            // Set the appropriate tab based on the image URL format
            if (imageUrl && (imageUrl.startsWith("data:") || imageUrl.includes("supabase"))) {
              setActiveTab("upload")
            } else if (imageUrl) {
              setActiveTab("url")
            }
          } else {
            setError("Product not found")
          }
        } catch (err) {
          console.error("Error loading product:", err)
          setError("Failed to load product details")
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadProduct()
  }, [params?.id, getProductById])

  // Set error from context
  useEffect(() => {
    if (contextError) {
      setError(contextError)
    }
  }, [contextError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Generate slug when name changes (only for new products)
    if (name === "name" && !params?.id && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      featured: checked,
    })
  }

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat) => cat.id === value)

    setFormData({
      ...formData,
      categoryId: value,
      category: selectedCategory ? selectedCategory.name : formData.category,
    })
  }

  const handleImageChange = (url: string | null) => {
    // Don't store blob URLs as they're temporary
    if (url && url.startsWith("blob:")) {
      console.warn("Blob URL detected, not storing:", url)
      return
    }

    setFormData({
      ...formData,
      image: url || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate image URL if using direct URL
      if (activeTab === "url" && formData.image) {
        if (!isValidImageUrl(formData.image)) {
          setError("Please enter a valid image URL")
          setIsSubmitting(false)
          return
        }
      }

      // Don't store blob URLs as they're temporary
      const imageUrl = formData.image && formData.image.startsWith("blob:") ? "" : formData.image

      // Convert string values to numbers for submission
      const productData = {
        ...formData,
        image: imageUrl,
        price: Number.parseFloat(formData.price) || 0,
        rating: Number.parseFloat(formData.rating) || 5,
        reviewCount: Number.parseInt(formData.reviewCount) || 0,
        stock: Number.parseInt(formData.stock) || 0,
      }

      console.log("Saving product with image:", imageUrl)

      if (params?.id) {
        // Update existing product
        await updateProduct({
          id: params.id as string,
          ...productData,
        })
        toast({
          title: "Product updated",
          description: `${formData.name} has been updated successfully.`,
        })
      } else {
        // Add new product
        await addProduct(productData)
        toast({
          title: "Product created",
          description: `${formData.name} has been created successfully.`,
        })
      }

      router.push("/admin/products")
    } catch (error: any) {
      console.error("Failed to save product:", error)

      // Handle specific errors
      if (error.message && error.message.includes("duplicate key") && error.message.includes("slug")) {
        setError("A product with this name already exists. Please use a different name or modify the slug.")
      } else {
        setError("Failed to save product. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-[60vh]">
        <LoadingOverlay />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center p-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price (PKR)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL Path)</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="product-url-path"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">Leave empty to generate automatically from name</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="url">Direct URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="pt-4">
                <ImageUpload
                  initialImage={activeTab === "upload" ? formData.image : undefined}
                  onImageChange={handleImageChange}
                />
              </TabsContent>
              <TabsContent value="url" className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                    <Label htmlFor="imageUrl">Image URL</Label>
                  </div>
                  <Input
                    id="imageUrl"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500">
                    Enter a direct URL to an image (e.g., https://example.com/image.jpg)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewCount">Review Count</Label>
              <Input
                id="reviewCount"
                name="reviewCount"
                type="number"
                value={formData.reviewCount}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="darazLink">Daraz Link (Optional)</Label>
              <Input
                id="darazLink"
                name="darazLink"
                value={formData.darazLink}
                onChange={handleChange}
                placeholder="https://www.daraz.pk/products/..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="featured">Featured Product</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : params?.id ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
