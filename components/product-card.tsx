import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative rounded-lg border bg-white p-4 transition-all hover:shadow-md">
      {product.darazLink && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
          Daraz
        </div>
      )}

      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        <h3 className="mt-4 text-lg font-medium">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <Button size="sm" variant="ghost" className="rounded-full">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </Link>
    </div>
  )
}
