"use client"

import { useState } from "react"
import Link from "next/link"
import { useOrders } from "@/contexts/order-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag } from "lucide-react"

// Format price in PKR
function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function OrdersPage() {
  const { orders } = useOrders()
  const [activeTab, setActiveTab] = useState("all")

  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length > 0 ? (
        <>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                        <div>
                          <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                          <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Items</h3>
                            <ul className="mt-2 divide-y">
                              {order.items.slice(0, 3).map((item) => (
                                <li key={item.productId} className="flex items-center py-2">
                                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
                                    <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div className="flex justify-between text-sm font-medium">
                                      <h4>{item.name}</h4>
                                      <p className="ml-4">x{item.quantity}</p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                              {order.items.length > 3 && (
                                <li className="py-2 text-sm text-gray-500">+{order.items.length - 3} more items</li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                            <p className="mt-2 text-sm">
                              {order.shippingAddress.name}
                              <br />
                              {order.shippingAddress.address}
                              <br />
                              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                              {order.shippingAddress.postalCode}
                            </p>

                            <h3 className="mt-4 text-sm font-medium text-gray-500">Total</h3>
                            <p className="mt-1 text-lg font-semibold">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/checkout/success?orderId=${order.id}`}>View Order Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-gray-600">
            You haven't placed any orders yet. Start shopping to place your first order.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
