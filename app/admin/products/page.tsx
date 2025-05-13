import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"
import StorageInitializer from "@/components/admin/storage-initializer"

export const metadata = {
  title: "Products - Admin",
  description: "Manage your products",
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <StorageInitializer />

      <ProductsTable />
    </div>
  )
}
