export interface Product {
  id: string
  name: string
  slug?: string
  description: string
  price: number
  salePrice?: number | null
  image: string
  images?: any[]
  category: string
  categoryId?: string | null
  rating: number
  reviewCount: number
  stock: number
  featured: boolean
  darazLink?: string
  specifications?: Record<string, any>
  tags?: string[]
}
