import ProductForm from "@/components/admin/product-form"

export const metadata = {
  title: "Add New Product - Admin",
  description: "Add a new product to your store",
}

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
