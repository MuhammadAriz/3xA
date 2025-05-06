"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import { initialProducts } from "@/lib/products"
import type { Product } from "@/lib/types"
import { isSupabaseConfigured, useSupabaseClient } from "@/lib/supabase"

type ProductContextType = {
  products: Product[]
  isLoading: boolean
  error: string | null
  getProductById: (id: string) => Product | undefined
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
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    image: dbProduct.image,
    category: dbProduct.category,
    rating: dbProduct.rating,
    reviewCount: dbProduct.review_count,
    stock: dbProduct.stock,
    featured: dbProduct.featured,
    darazLink: dbProduct.daraz_link || undefined,
    // Add new fields
    slug: dbProduct.slug || dbProduct.name.toLowerCase().replace(/\s+/g, "-"),
    salePrice: dbProduct.sale_price || null,
    images: dbProduct.images || [],
    categoryId: dbProduct.category_id || null,
    specifications: dbProduct.specifications || {},
    tags: dbProduct.tags || [],
  }
}

// Helper function to convert from app format to database format
function mapProductToDbProduct(product: Product | Omit<Product, "id">) {
  // Generate a slug if not provided
  const slug = "slug" in product && product.slug ? product.slug : product.name.toLowerCase().replace(/\s+/g, "-")

  return {
    name: product.name,
    slug: slug,
    description: product.description,
    price: product.price,
    sale_price: "salePrice" in product ? product.salePrice : null,
    image: product.image,
    images: "images" in product ? product.images : [],
    category_id: "categoryId" in product ? product.categoryId : null,
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
  const refreshProducts = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch from Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          // Add a timeout to the fetch operation
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Supabase connection timed out")), 5000),
          )

          const fetchPromise = supabase.from("products").select("*").order("created_at", { ascending: false })

          // Race between the fetch and the timeout
          const { data: dbProducts, error } = (await Promise.race([
            fetchPromise,
            timeoutPromise.then(() => {
              throw new Error("Connection timed out")
            }),
          ])) as any

          if (error) {
            // If the error is about the table not existing, we'll handle it gracefully
            if (error.message && error.message.includes("does not exist")) {
              console.warn("Products table does not exist yet. Using local data instead.")
              // Continue to the fallback logic below
            } else {
              throw error
            }
          } else if (dbProducts && dbProducts.length > 0) {
            // Map database products to our app's product format
            const mappedProducts = dbProducts.map(mapDbProductToProduct)
            setProducts(mappedProducts)
            return
          }
        } catch (supabaseError) {
          console.error("Supabase error:", supabaseError)
          // Log more details about the error
          if (supabaseError instanceof Error) {
            console.error("Error message:", supabaseError.message)
            console.error("Error stack:", supabaseError.stack)
          }
          // Continue to fallback logic
        }
      }

      // Fallback to localStorage or use initial data
      console.log("Falling back to local data")
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts)
        } else {
          setProducts(initialProducts)
          localStorage.setItem("products", JSON.stringify(initialProducts))
        }
      } else {
        setProducts(initialProducts)
        localStorage.setItem("products", JSON.stringify(initialProducts))
      }
    } catch (error) {
      console.error("Failed to load products:", error)
      setError("Failed to load products. Please try again.")

      // Fallback to localStorage or initial data
      try {
        const savedProducts = localStorage.getItem("products")
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts)
          if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
            setProducts(parsedProducts)
          } else {
            setProducts(initialProducts)
            localStorage.setItem("products", JSON.stringify(initialProducts))
          }
        } else {
          setProducts(initialProducts)
          localStorage.setItem("products", JSON.stringify(initialProducts))
        }
      } catch (localError) {
        console.error("Failed to load products from localStorage:", localError)
        setProducts(initialProducts)
        localStorage.setItem("products", JSON.stringify(initialProducts))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id)
  }

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
      // Try to add to Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const dbProduct = mapProductToDbProduct(product)

        const { data, error } = await supabase.from("products").insert(dbProduct).select().single()

        if (error) {
          throw error
        }

        // Map the returned database product to our app's product format
        const newProduct = mapDbProductToProduct(data)

        // Update local state
        setProducts((prevProducts) => [...prevProducts, newProduct])
        return newProduct
      }

      // Fallback to localStorage
      const newProduct = {
        ...product,
        id: uuidv4(),
      }

      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return newProduct
    } catch (error) {
      console.error("Failed to add product:", error)

      // Fallback to localStorage
      const newProduct = {
        ...product,
        id: uuidv4(),
      }

      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return newProduct
    }
  }

  const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    try {
      // Try to update in Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const dbProduct = mapProductToDbProduct(updatedProduct)

        const { error } = await supabase.from("products").update(dbProduct).eq("id", updatedProduct.id)

        if (error) {
          throw error
        }
      }

      // Update local state
      const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return updatedProduct
    } catch (error) {
      console.error("Failed to update product:", error)

      // Fallback to localStorage
      const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return updatedProduct
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      // Try to delete from Supabase if configured
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("products").delete().eq("id", id)

        if (error) {
          throw error
        }
      }

      // Update local state
      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return true
    } catch (error) {
      console.error("Failed to delete product:", error)

      // Fallback to localStorage
      const updatedProducts = products.filter((product) => product.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return true
    }
  }

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
