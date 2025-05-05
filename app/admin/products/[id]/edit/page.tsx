"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"
import { useProducts } from "@/contexts/product-context"

export default function EditProductPage() {
  const params = useParams()
  const { getProductById } = useProducts()
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    if (params?.id) {
      const product = getProductById(params.id as string)
      setExists(!!product)
    }
  }, [params?.id, getProductById])

  if (exists === false) {
    notFound()
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>
      <ProductForm />
    </div>
  )
}
