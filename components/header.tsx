"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import Search from "@/components/search"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

function SearchFallback() {
  return (
    <Button variant="ghost" size="icon">
      <span className="h-5 w-5 animate-pulse rounded-full bg-gray-200"></span>
      <span className="sr-only">Search loading</span>
    </Button>
  )
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-lg font-bold">
                  3xA
                </Link>
                <Link href="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-sm font-medium">
                  Products
                </Link>
                <Link href="#daraz-integration" className="text-sm font-medium">
                  Daraz Store
                </Link>
                <Link href="/about" className="text-sm font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-sm font-medium">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="ml-4 text-xl font-bold md:ml-0">
            3xA
          </Link>

          <nav className="ml-8 hidden md:flex md:items-center md:gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium">
              Products
            </Link>
            <Link href="#daraz-integration" className="text-sm font-medium">
              Daraz Store
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Suspense fallback={<SearchFallback />}>
            <Search />
          </Suspense>

          <div className="relative">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                {itemCount > 0 && (
                  <Badge
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                    variant="destructive"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
