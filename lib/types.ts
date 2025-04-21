export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviewCount: number
  stock: number
  featured: boolean
  darazLink?: string
}
