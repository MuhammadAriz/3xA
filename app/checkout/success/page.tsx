"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/contexts/order-context"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Format price in PKR
function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<any>(null)
  const [orderDate, setOrderDate] = useState("")

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId)
      setOrder(orderData)

      // Format the order date for display
      if (orderData?.date) {
        const date = new Date(orderData.date)
        setOrderDate(
          date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        )
      }
    }
  }, [orderId, getOrderById])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {order ? (
          <Card>
            <CardHeader>
              <CardTitle>Order #{orderId?.substring(0, 8)}</CardTitle>
              <CardDescription>Placed on {orderDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Items</h3>
                  <div className="mt-2 divide-y">
                    {order.items.map((item: any) => (
                      <div key={item.productId} className="flex items-center py-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium">
                            <h3>{item.name}</h3>
                            <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Shipping Address</h3>
                    <div className="mt-2 text-sm">
                      <p>{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium">Payment Method</h3>
                    <p className="mt-2 text-sm capitalize">{order.paymentMethod}</p>

                    <h3 className="mt-4 font-medium">Order Status</h3>
                    <div className="mt-2 flex items-center">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p>Order details not found. Please check your order history.</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button asChild variant="outline">
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/orders">View Orders</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
