import { getAllProducts } from "@/lib/products"
import ProductCard from "./product-card"

export default async function ProductList() {
  const products = await getAllProducts()

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
