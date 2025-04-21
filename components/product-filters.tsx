"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "home", name: "Home & Kitchen" },
    { id: "beauty", name: "Beauty & Personal Care" },
  ]

  const brands = [
    { id: "brand1", name: "Brand 1" },
    { id: "brand2", name: "Brand 2" },
    { id: "brand3", name: "Brand 3" },
    { id: "brand4", name: "Brand 4" },
  ]

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-semibold">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={`category-${category.id}`} />
              <label htmlFor={`category-${category.id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox id={`brand-${brand.id}`} />
              <label htmlFor={`brand-${brand.id}`} className="text-sm">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="py-4"
        />
        <div className="mt-2 flex items-center justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold">Availability</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" />
            <label htmlFor="in-stock" className="text-sm">
              In Stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="daraz-available" />
            <label htmlFor="daraz-available" className="text-sm">
              Available on Daraz
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block">
        <div className="sticky top-24 rounded-lg border bg-white p-6">{filters}</div>
      </div>

      <div className="mb-6 flex items-center justify-between md:hidden">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filters}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
