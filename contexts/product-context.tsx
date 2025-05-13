"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { initialProducts } from "@/lib/products"
import type { Product } from "@/lib/types"
import { isSupabaseConfigured, useSupabaseClient } from "@/lib/supabase"

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

// Helper function to generate a unique slug
function generateUniqueSlug(name: string, existingSlugs: string[] = []): string {
  // Base slug from name
  const baseSlug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

  // If the base slug is not in use, return it
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  // Add a timestamp to make it unique
  const timestamp = Date.now().toString().slice(-6)
  return `${baseSlug}-${timestamp}`
}

type ProductContextType = {
  products: Product[]
  isLoading: boolean
  error: string | null
  getProductById: (id: string) => Promise<Product | null>
  getFeaturedProducts: () => Product[]
  getRelatedProducts: (productId: string) => Product[]
  addProduct: (product: Omit<Product, "id">) => Promise<Product>
  updateProduct: (product: Product) => Promise<Product>
  deleteProduct: (id: string) => Promise<boolean>
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Helper function to convert from database format to app format
function mapDbProductToProduct(dbProduct: any): Product {
  // Ensure we don't store blob URLs
  const imageUrl = dbProduct.image && dbProduct.image.startsWith("blob:") ? "" : dbProduct.image

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    image: imageUrl,
    category: dbProduct.category,
    categoryId: dbProduct.category_id || null,
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    stock: dbProduct.stock,
    featured: dbProduct.featured,
    darazLink: dbProduct.daraz_link || undefined,
    // Add new fields
    slug: dbProduct.slug || dbProduct.name.toLowerCase().replace(/\s+/g, "-"),
    salePrice: dbProduct.sale_price || null,
    images: dbProduct.images || [],
    specifications: dbProduct.specifications || {},
    tags: dbProduct.tags || [],
  }
}

// Helper function to convert from app format to database format
function mapProductToDbProduct(product: Product | Omit<Product, "id">, existingSlugs: string[] = []) {
  // Generate a unique slug if not provided
  const slug = "slug" in product && product.slug ? product.slug : generateUniqueSlug(product.name, existingSlugs)

  // Ensure we don't store blob URLs
  const imageUrl = product.image && product.image.startsWith("blob:") ? "" : product.image

  return {
    name: product.name,
    slug: slug,
    description: product.description,
    price: product.price,
    sale_price: "salePrice" in product ? product.salePrice : null,
    image: imageUrl,
    images: "images" in product ? product.images : [],
    category_id: product.categoryId || null,
    category: product.category,
    rating: product.rating,
    review_count: product.reviewCount,
    stock: product.stock,
    featured: product.featured,
    daraz_link: product.darazLink || null,
    specifications: "specifications" in product ? product.specifications : {},
    tags: "tags" in product ? product.tags : [],
  }
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabaseClient()

  // Load products on initial render
  useEffect(() => {
    refreshProducts()
  }, [])

  // Fetch products from Supabase or localStorage
  const refreshProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (supabase) {
        const { data, error } = await supabase.from("products").select("*").order("name")

        if (error) {
          throw error
        }

        if (data) {
          // Filter out products with blob URLs
          const validProducts = data.map((product) => {
            if (product.image && product.image.startsWith("blob:")) {
              console.warn("Found product with blob URL, removing URL:", product.id)
              return { ...product, image: "" }
            }
            return product
          })

          setProducts(validProducts as Product[])
          return
        }
      }

      // Fallback to mock data if Supabase is not available or returns no data
      setProducts(initialProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Using local data instead.")
      // Fallback to mock data on error
      setProducts(initialProducts)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const getProductById = useCallback(
    async (id: string): Promise<Product | null> => {
      setIsLoading(true)
      try {
        // Try to get from Supabase first
        if (supabase) {
          const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

          if (error) {
            throw error
          }

          if (data) {
            const product = mapDbProductToProduct(data)

            // Check if the image URL is valid
            if (product.image && !isValidImageUrl(product.image)) {
              console.warn("Invalid image URL found, clearing:", product.image)
              product.image = ""
            }

            return product
          }
        }

        // Fallback to local data
        const product = products.find((p) => p.id === id)

        if (product) {
          // Check if the image URL is valid
          if (product.image && !isValidImageUrl(product.image)) {
            console.warn("Invalid image URL found in local data, clearing:", product.image)
            return { ...product, image: "" }
          }
        }

        return product || null
      } catch (error) {
        console.error("Error fetching product by ID:", error)
        // Fallback to local data on error
        const product = products.find((p) => p.id === id)
        return product || null
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, products],
  )

  const getFeaturedProducts = () => {
    return products.filter((product) => product.featured)
  }

  const getRelatedProducts = (productId: string) => {
    const currentProduct = products.find((product) => product.id === productId)
    if (!currentProduct) return []

    return products
      .filter((product) => product.id !== productId && product.category === currentProduct.category)
      .slice(0, 4)
  }

  const addProduct = async (product: Omit<Product, "id">): Promise<Product> => {
    try {
      // Ensure we don't store blob URLs
      const imageUrl = product.image && product.image.startsWith("blob:") ? "" : product.image

      const productWithValidImage = {
        ...product,
        image: imageUrl,
      }

      // Get existing slugs to ensure uniqueness
      const existingSlugs: string[] = products.map((p) => p.slug || "")

      // Try to add to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const dbProduct = mapProductToDbProduct(productWithValidImage, existingSlugs)

        try {
          const { data, error } = await supabase.from("products").insert(dbProduct).select().single()

          if (error) {
            // Check if it's a duplicate slug error
            if (error.message && error.message.includes("duplicate key") && error.message.includes("slug")) {
              // Try again with a timestamp added to the slug
              const timestamp = Date.now().toString().slice(-6)
              const newSlug = `${dbProduct.slug}-${timestamp}`

              const { data: retryData, error: retryError } = await supabase
                .from("products")
                .insert({ ...dbProduct, slug: newSlug })
                .select()
                .single()

              if (retryError) throw retryError

              // Map the returned database product to our app's product format
              const newProduct = mapDbProductToProduct(retryData)

              // Update local state
              setProducts((prevProducts) => [...prevProducts, newProduct])
              return newProduct
            }

            throw error
          }

          // Map the returned database product to our app's product format
          const newProduct = mapDbProductToProduct(data)

          // Update local state
          setProducts((prevProducts) => [...prevProducts, newProduct])
          return newProduct
        } catch (error) {
          console.error("Supabase error:", error)
          throw error
        }
      }

      // Fallback to localStorage
      const newProduct = {
        ...productWithValidImage,
        id: uuidv4(),
        slug: generateUniqueSlug(productWithValidImage.name, existingSlugs),
      }

      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return newProduct
    } catch (error) {
      console.error("Failed to add product:", error)
      throw error
    }
  }

  const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    try {
      // Ensure we don't store blob URLs
      const imageUrl = updatedProduct.image && updatedProduct.image.startsWith("blob:") ? "" : updatedProduct.image

      const productWithValidImage = {
        ...updatedProduct,
        image: imageUrl,
      }

      // Get existing slugs to ensure uniqueness (excluding the current product's slug)
      const existingSlugs: string[] = products.filter((p) => p.id !== updatedProduct.id).map((p) => p.slug || "")

      // Try to update in Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const dbProduct = mapProductToDbProduct(productWithValidImage, existingSlugs)

        try {
          const { error } = await supabase.from("products").update(dbProduct).eq("id", updatedProduct.id)

          if (error) {
            // Check if it's a duplicate slug error
            if (error.message && error.message.includes("duplicate key") && error.message.includes("slug")) {
              // Try again with a timestamp added to the slug
              const timestamp = Date.now().toString().slice(-6)
              const newSlug = `${dbProduct.slug}-${timestamp}`

              const { error: retryError } = await supabase
                .from("products")
                .update({ ...dbProduct, slug: newSlug })
                .eq("id", updatedProduct.id)

              if (retryError) throw retryError

              // Update the product with the new slug
              productWithValidImage.slug = newSlug
            } else {
              throw error
            }
          }
        } catch (error) {
          console.error("Supabase error:", error)
          throw error
        }
      }

      // Update local state
      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? productWithValidImage : product,
      )
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return productWithValidImage
    } catch (error) {
      console.error("Failed to update product:", error)
      throw error
    }
  }

  const deleteProduct = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        if (supabase) {
          const { error } = await supabase.from("products").delete().eq("id", id)

          if (error) {
            throw error
          }
        }

        // Update local state regardless of whether Supabase is available
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
        return true
      } catch (error) {
        console.error("Error deleting product:", error)
        setError("Failed to delete product. Please try again.")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [supabase],
  )

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        getProductById,
        getFeaturedProducts,
        getRelatedProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}
