import { Suspense } from "react"
import ProductList from "@/components/product-list"
import { ProductFiltersWrapper } from "@/components/product-filters"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Products | 3xA",
  description: "Browse our collection of high-quality products",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Our Products</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <ProductFiltersWrapper />
        </div>

        <div className="md:col-span-3">
          <Suspense fallback={<ProductsLoadingSkeleton />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <Skeleton className="mt-4 h-6 w-1/4" />
          </div>
        ))}
    </div>
  )
}
