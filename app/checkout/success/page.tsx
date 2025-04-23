"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDate, setOrderDate] = useState("")

  useEffect(() => {
    // Format the current date for display
    const date = new Date()
    setOrderDate(
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    )
  }, [])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="mt-8 rounded-lg bg-gray-50 p-6 text-left">
          <div className="mb-4 flex justify-between">
            <span className="font-medium">Order Number:</span>
            <span>{orderId || "N/A"}</span>
          </div>
          <div className="mb-4 flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Method:</span>
            <span>Credit Card / Cash on Delivery</span>
          </div>
        </div>

        <p className="mt-8 text-gray-600">
          We've sent a confirmation email with the order details and tracking information.
        </p>

        <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
