import type { Product } from "./types"
import type { User } from "@/contexts/auth-context"

// This file will be used to connect to the database
// For now, it uses localStorage, but will be updated to use a database

// Product Service
export const ProductService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      // This will be replaced with a database call
      const savedProducts = localStorage.getItem("products")
      if (savedProducts) {
        return JSON.parse(savedProducts)
      }
      return []
    } catch (error) {
      console.error("Failed to get products:", error)
      throw new Error("Failed to get products")
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const products = await ProductService.getAllProducts()
      return products.find((product) => product.id === id) || null
    } catch (error) {
      console.error(`Failed to get product with ID ${id}:`, error)
      throw new Error(`Failed to get product with ID ${id}`)
    }
  },

  // Create product
  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    try {
      const products = await ProductService.getAllProducts()
      const newProduct = {
        ...product,
        id: crypto.randomUUID(),
      }

      const updatedProducts = [...products, newProduct]
      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return newProduct
    } catch (error) {
      console.error("Failed to create product:", error)
      throw new Error("Failed to create product")
    }
  },

  // Update product
  updateProduct: async (product: Product): Promise<Product> => {
    try {
      const products = await ProductService.getAllProducts()
      const index = products.findIndex((p) => p.id === product.id)

      if (index === -1) {
        throw new Error(`Product with ID ${product.id} not found`)
      }

      products[index] = product
      localStorage.setItem("products", JSON.stringify(products))

      return product
    } catch (error) {
      console.error(`Failed to update product with ID ${product.id}:`, error)
      throw new Error(`Failed to update product with ID ${product.id}`)
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const products = await ProductService.getAllProducts()
      const updatedProducts = products.filter((product) => product.id !== id)

      localStorage.setItem("products", JSON.stringify(updatedProducts))

      return true
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error)
      throw new Error(`Failed to delete product with ID ${id}`)
    }
  },
}

// Auth Service
export const AuthService = {
  // Login
  login: async (username: string, password: string): Promise<User | null> => {
    try {
      // This will be replaced with a database call
      // For now, use hardcoded credentials
      if (username === "admin" && password === "password") {
        const user: User = {
          id: "1",
          username: "admin",
          email: "admin@example.com",
          role: "admin",
        }

        localStorage.setItem("user", JSON.stringify(user))
        return user
      }

      return null
    } catch (error) {
      console.error("Login failed:", error)
      throw new Error("Login failed")
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        return JSON.parse(storedUser)
      }
      return null
    } catch (error) {
      console.error("Failed to get current user:", error)
      throw new Error("Failed to get current user")
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("adminAuthenticated")
    } catch (error) {
      console.error("Logout failed:", error)
      throw new Error("Logout failed")
    }
  },
}
