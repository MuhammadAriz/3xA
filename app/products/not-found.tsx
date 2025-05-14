"use client"
export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ProductNotFoundContent() {
  // Using the hook inside a component that will be wrapped in Suspense
  const searchParams = useSearchParams()
  const productId = searchParams.get("id") || "unknown"

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mb-6 text-3xl font-semibold">Product Not Found</h2>
      <p className="mb-8 max-w-md text-gray-600">
        The product you are looking for (ID: {productId}) might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  )
}

export default function ProductNotFound() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-6 text-3xl font-semibold">Product Not Found</h2>
          <p className="mb-8 max-w-md text-gray-600">Loading...</p>
        </div>
      }
    >
      <ProductNotFoundContent />
    </Suspense>
  )
}
