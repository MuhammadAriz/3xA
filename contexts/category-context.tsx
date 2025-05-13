"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSupabaseClient } from "@/lib/supabase"

type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

type CategoryContextType = {
  categories: Category[]
  isLoading: boolean
  error: string | null
  refreshCategories: () => Promise<void>
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  isLoading: false,
  error: null,
  refreshCategories: async () => {},
})

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabaseClient()

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!supabase) {
        // Use mock data if Supabase is not available
        setCategories([
          { id: "1", name: "Electronics", slug: "electronics", description: "Electronic devices" },
          { id: "2", name: "Clothing", slug: "clothing", description: "Apparel and accessories" },
          { id: "3", name: "Home & Kitchen", slug: "home-kitchen", description: "Home goods and furniture" },
          { id: "4", name: "Books", slug: "books", description: "Books and publications" },
          { id: "5", name: "Toys & Games", slug: "toys-games", description: "Toys and games for all ages" },
        ])
        return
      }

      const { data, error } = await supabase.from("categories").select("*").order("name")

      if (error) throw error

      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again.")
      // Use mock data as fallback
      setCategories([
        { id: "1", name: "Electronics", slug: "electronics", description: "Electronic devices" },
        { id: "2", name: "Clothing", slug: "clothing", description: "Apparel and accessories" },
        { id: "3", name: "Home & Kitchen", slug: "home-kitchen", description: "Home goods and furniture" },
        { id: "4", name: "Books", slug: "books", description: "Books and publications" },
        { id: "5", name: "Toys & Games", slug: "toys-games", description: "Toys and games for all ages" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [supabase])

  const refreshCategories = async () => {
    await fetchCategories()
  }

  return (
    <CategoryContext.Provider value={{ categories, isLoading, error, refreshCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => useContext(CategoryContext)
