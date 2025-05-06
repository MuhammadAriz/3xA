import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable />
      </Suspense>
    </div>
  )
}
