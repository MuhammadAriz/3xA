"use client"

import { useEffect, useState } from "react"
import { useProducts } from "@/contexts/product-context"
import ProductCard from "./product-card"
import type { Product } from "@/lib/types"

export default function RelatedProducts({ currentProductId }: { currentProductId: string }) {
  const { getRelatedProducts, isLoading } = useProducts()
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    // Make sure getRelatedProducts exists before calling it
    if (getRelatedProducts) {
      setRelatedProducts(getRelatedProducts(currentProductId))
    }
  }, [getRelatedProducts, currentProductId])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
