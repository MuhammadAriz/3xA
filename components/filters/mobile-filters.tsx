"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CategoryFilters } from "./category-filters"
import { BrandFilters } from "./brand-filters"
import { PriceRangeFilter } from "./price-range-filter"
import { AvailabilityFilters } from "./availability-filters"
import { useFilters } from "@/contexts/filter-context"

export function MobileFilters() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { applyFilters, resetFilters } = useFilters()

  const categories = [
    { id: "electronics", name: "Electronics" },
    { id: "clothing", name: "Clothing" },
    { id: "home", name: "Home & Kitchen" },
    { id: "fitness", name: "Fitness" },
  ]

  const brands = [
    { id: "brand1", name: "Brand 1" },
    { id: "brand2", name: "Brand 2" },
    { id: "brand3", name: "Brand 3" },
    { id: "brand4", name: "Brand 4" },
  ]

  const handleApplyFilters = () => {
    applyFilters()
    setMobileFiltersOpen(false)
  }

  return (
    <div className="mb-6 flex items-center justify-between">
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
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-semibold">Categories</h3>
              <CategoryFilters categories={categories} />
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-sm font-semibold">Brands</h3>
              <BrandFilters brands={brands} />
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
              <PriceRangeFilter />
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 text-sm font-semibold">Availability</h3>
              <AvailabilityFilters />
            </div>

            <div className="border-t pt-6">
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetFilters()
                    setMobileFiltersOpen(false)
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
