"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"
import type { ButtonProps } from "@/components/ui/button"

interface AddToCartButtonProps extends ButtonProps {
  product: Product
  quantity?: number
  showIcon?: boolean
}

export default function AddToCartButton({ product, quantity = 1, showIcon = true, ...props }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, quantity)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <Button onClick={handleAddToCart} className="gap-2" {...props}>
      {showIcon && <ShoppingCart className="h-5 w-5" />}
      Add to Cart
    </Button>
  )
}
