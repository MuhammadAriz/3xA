import type { Product } from "./types"

// Mock data for products with prices in PKR
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with crystal clear sound and long battery life.",
    price: 12999,
    image: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    rating: 4.5,
    reviewCount: 128,
    stock: 15,
    featured: true,
    darazLink: "https://www.daraz.pk/products/headphones",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    description: "Track your fitness, receive notifications, and more with this advanced smartwatch.",
    price: 19999,
    image: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    rating: 4.8,
    reviewCount: 95,
    stock: 8,
    featured: true,
    darazLink: "https://www.daraz.pk/products/smartwatch",
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    description: "Comfortable chair with lumbar support for long working hours.",
    price: 24999,
    image: "/placeholder.svg?height=400&width=400",
    category: "home",
    rating: 4.3,
    reviewCount: 67,
    stock: 12,
    featured: false,
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable t-shirt made from 100% organic cotton.",
    price: 2499,
    image: "/placeholder.svg?height=400&width=400",
    category: "clothing",
    rating: 4.2,
    reviewCount: 42,
    stock: 50,
    featured: false,
    darazLink: "https://www.daraz.pk/products/tshirt",
  },
  {
    id: "5",
    name: "Professional DSLR Camera",
    description: "Capture stunning photos and videos with this high-quality camera.",
    price: 89999,
    image: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    rating: 4.9,
    reviewCount: 31,
    stock: 5,
    featured: true,
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks hot or cold for hours with this insulated bottle.",
    price: 2999,
    image: "/placeholder.svg?height=400&width=400",
    category: "home",
    rating: 4.1,
    reviewCount: 89,
    stock: 35,
    featured: false,
    darazLink: "https://www.daraz.pk/products/waterbottle",
  },
  {
    id: "7",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging for compatible smartphones and devices.",
    price: 3999,
    image: "/placeholder.svg?height=400&width=400",
    category: "electronics",
    rating: 4.4,
    reviewCount: 56,
    stock: 20,
    featured: true,
    darazLink: "https://www.daraz.pk/products/charger",
  },
  {
    id: "8",
    name: "Premium Yoga Mat",
    description: "Non-slip, eco-friendly yoga mat for comfortable practice.",
    price: 1, // Special product with price of PKR 1
    image: "/placeholder.svg?height=400&width=400",
    category: "fitness",
    rating: 4.7,
    reviewCount: 73,
    stock: 18,
    featured: true,
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getAllProducts(): Promise<Product[]> {
  await delay(500) // Simulate network delay
  return products
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await delay(300)
  return products.filter((product) => product.featured)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  await delay(200)
  return products.find((product) => product.id === id)
}

export async function getRelatedProducts(currentId: string): Promise<Product[]> {
  await delay(300)
  const currentProduct = products.find((product) => product.id === currentId)
  if (!currentProduct) return []

  return products
    .filter((product) => product.id !== currentId && product.category === currentProduct.category)
    .slice(0, 4)
}
