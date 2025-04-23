import { getAllProducts } from "@/lib/products"
import ProductCard from "./product-card"

export default async function ProductList({
  searchQuery,
  filters,
}: {
  searchQuery?: string
  filters?: {
    categories?: string[]
    brands?: string[]
    priceRange?: [number, number]
    inStock?: boolean
    onDaraz?: boolean
  }
}) {
  const products = await getAllProducts()

  // Filter products based on search query
  let filteredProducts = products

  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    )
  }

  // Apply additional filters if provided
  if (filters) {
    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) => filters.categories?.includes(product.category))
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
    }

    // Filter by availability
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter((product) => product.stock > 0)
    }

    // Filter by Daraz availability
    if (filters.onDaraz) {
      filteredProducts = filteredProducts.filter((product) => !!product.darazLink)
    }
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
