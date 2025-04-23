"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, ArrowLeft, ShoppingBag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

// Format price in PKR
function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()
  const cartTotal = getCartTotal()
  const itemCount = getCartCount()

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = Number.parseInt(value)
    if (!isNaN(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-gray-600">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-white">
            <div className="p-6">
              <div className="hidden border-b pb-4 md:grid md:grid-cols-6">
                <div className="col-span-3 font-medium">Product</div>
                <div className="col-span-1 text-center font-medium">Price</div>
                <div className="col-span-1 text-center font-medium">Quantity</div>
                <div className="col-span-1 text-right font-medium">Total</div>
              </div>

              {items.map((item) => (
                <div key={item.product.id} className="border-b py-4 last:border-0">
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-6">
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.product.name}</h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="mt-1 flex items-center text-sm text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 text-center">
                      <span className="md:hidden font-medium">Price: </span>
                      {formatPrice(item.product.price)}
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <div className="w-20">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                          className="h-8 text-center"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 text-right font-medium">
                      <span className="md:hidden font-medium">Total: </span>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/products"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <Button className="mt-6 w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Secure Checkout</AlertTitle>
              <AlertDescription>Your payment information is processed securely.</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
