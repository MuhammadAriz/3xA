"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

type FilterContextType = {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  inStock: boolean
  onDaraz: boolean
  setCategories: (categories: string[]) => void
  setBrands: (brands: string[]) => void
  setPriceRange: (range: [number, number]) => void
  setInStock: (inStock: boolean) => void
  setOnDaraz: (onDaraz: boolean) => void
  applyFilters: () => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Use a ref to track if this is the initial mount
  const isInitialMount = useRef(true)

  // Initialize state from URL params
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [inStock, setInStock] = useState(false)
  const [onDaraz, setOnDaraz] = useState(false)

  // Load filters from URL on initial render only
  useEffect(() => {
    if (!isInitialMount.current) {
      return // Skip effect if not initial mount
    }

    const categoriesParam = searchParams.get("categories")
    const brandsParam = searchParams.get("brands")
    const minPriceParam = searchParams.get("minPrice")
    const maxPriceParam = searchParams.get("maxPrice")
    const inStockParam = searchParams.get("inStock")
    const onDarazParam = searchParams.get("onDaraz")

    // Only update state if the values are different
    if (categoriesParam) {
      const newCategories = categoriesParam.split(",")
      if (JSON.stringify(newCategories) !== JSON.stringify(categories)) {
        setCategories(newCategories)
      }
    }

    if (brandsParam) {
      const newBrands = brandsParam.split(",")
      if (JSON.stringify(newBrands) !== JSON.stringify(brands)) {
        setBrands(newBrands)
      }
    }

    if (minPriceParam && maxPriceParam) {
      const newPriceRange: [number, number] = [Number(minPriceParam), Number(maxPriceParam)]
      if (newPriceRange[0] !== priceRange[0] || newPriceRange[1] !== priceRange[1]) {
        setPriceRange(newPriceRange)
      }
    }

    if (inStockParam && (inStockParam === "true") !== inStock) {
      setInStock(inStockParam === "true")
    }

    if (onDarazParam && (onDarazParam === "true") !== onDaraz) {
      setOnDaraz(onDarazParam === "true")
    }

    // Mark initial mount as complete
    isInitialMount.current = false

    // We're intentionally not including state variables in the dependency array
    // to prevent infinite loops, as we only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Apply filters by updating URL - only called explicitly by user action
  const applyFilters = () => {
    const params = new URLSearchParams()

    // Preserve existing search query if any
    const query = searchParams.get("q")
    if (query) {
      params.set("q", query)
    }

    if (categories.length > 0) {
      params.set("categories", categories.join(","))
    }

    if (brands.length > 0) {
      params.set("brands", brands.join(","))
    }

    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }

    if (inStock) {
      params.set("inStock", "true")
    }

    if (onDaraz) {
      params.set("onDaraz", "true")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  // Reset all filters
  const resetFilters = () => {
    setCategories([])
    setBrands([])
    setPriceRange([0, 1000])
    setInStock(false)
    setOnDaraz(false)

    // Preserve search query if any
    const query = searchParams.get("q")
    if (query) {
      router.push(`${pathname}?q=${query}`)
    } else {
      router.push(pathname)
    }
  }

  return (
    <FilterContext.Provider
      value={{
        categories,
        brands,
        priceRange,
        inStock,
        onDaraz,
        setCategories,
        setBrands,
        setPriceRange,
        setInStock,
        setOnDaraz,
        applyFilters,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
