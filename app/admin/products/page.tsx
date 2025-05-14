import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ProductsTable from "@/components/admin/products-table"
import StorageSetupGuide from "@/components/admin/storage-setup-guide"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <StorageSetupGuide />

      <div className="mt-8">
        <ProductsTable />
      </div>
    </div>
  )
}
