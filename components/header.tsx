"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, setTheme } = useTheme()

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
          {searchOpen ? (
            <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-white px-4">
              <Input type="search" placeholder="Search products..." className="flex-1 md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
