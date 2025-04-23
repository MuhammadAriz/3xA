"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      {isOpen ? (
        <div className="absolute inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-white px-4">
          <form onSubmit={handleSearch} className="flex flex-1 items-center">
            <Input
              type="search"
              placeholder="Search products..."
              className="flex-1 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <SearchIcon className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </>
  )
}
