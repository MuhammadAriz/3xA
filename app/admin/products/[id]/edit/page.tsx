import ProductForm from "@/components/admin/product-form"

export const metadata = {
  title: "Edit Product - Admin",
  description: "Edit product details",
}

export default function EditProductPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>
      <ProductForm />
    </div>
  )
}
