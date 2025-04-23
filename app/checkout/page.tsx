"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { createOrder } from "@/app/actions/order"

// Format price in PKR
function formatPrice(price: number): string {
  return `PKR ${price.toLocaleString()}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const subtotal = getCartTotal()

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
    saveInfo: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create order in the database
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }))

      const order = await createOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: orderItems,
        subtotal,
        paymentMethod,
      })

      // If using card payment, redirect to Stripe
      if (paymentMethod === "card") {
        // This would normally redirect to Stripe checkout
        // For now, we'll simulate success
        setTimeout(() => {
          clearCart()
          router.push(`/checkout/success?orderId=${order.id}`)
        }, 1500)
      } else {
        // For cash on delivery, go directly to success page
        clearCart()
        router.push(`/checkout/success?orderId=${order.id}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="rounded-lg border bg-white p-6">
              <h2 className="text-xl font-semibold">Contact Information</h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border bg-white p-6">
              <h2 className="text-xl font-semibold">Shipping Address</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => setFormData({ ...formData, saveInfo: checked === true })}
                  />
                  <label
                    htmlFor="saveInfo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Save this information for next time
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border bg-white p-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>

              <RadioGroup className="mt-4" value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1">
                    Credit/Debit Card
                  </Label>
                  <div className="flex space-x-1">
                    <div className="h-6 w-10 rounded bg-gray-200"></div>
                    <div className="h-6 w-10 rounded bg-gray-200"></div>
                    <div className="h-6 w-10 rounded bg-gray-200"></div>
                  </div>
                </div>

                <div className="mt-2 flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex-1">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="mt-6 w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Complete Order • ${formatPrice(subtotal)}`}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="ml-1 text-gray-600">x{item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at next step</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
