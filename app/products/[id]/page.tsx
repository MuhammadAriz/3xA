import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/products"
import RelatedProducts from "@/components/related-products"
import AddToCartButton from "@/components/add-to-cart-button"

// Format price in PKR
function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    }
  }

  return {
    title: `${product.name} | 3xA`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center">
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{product.reviewCount} reviews</span>
          </div>

          <div className="mt-6 text-2xl font-bold">{formatPrice(product.price)}</div>

          {product.stock > 0 ? (
            <div className="mt-2 text-sm text-green-600">In Stock ({product.stock} available)</div>
          ) : (
            <div className="mt-2 text-sm text-red-600">Out of Stock</div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <AddToCartButton product={product} variant="default" size="lg" />
            <Button variant="outline" size="lg" asChild>
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>

          {product.darazLink && (
            <div className="mt-6 rounded-lg bg-orange-50 p-4">
              <h3 className="flex items-center text-sm font-medium text-orange-800">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#FF6A00"
                  />
                  <path
                    d="M7 12.6667L10.3333 16L17 9.33334"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Also available on Daraz
              </h3>
              <Link href={product.darazLink} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="mt-2 w-full border-orange-200 bg-white text-orange-800 hover:bg-orange-100"
                >
                  View on Daraz
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold">Related Products</h2>
        <RelatedProducts currentProductId={params.id} />
      </div>
    </div>
  )
}
