import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryFilters } from "./filters/category-filters"
import { BrandFilters } from "./filters/brand-filters"
import { PriceRangeFilter } from "./filters/price-range-filter"
import { AvailabilityFilters } from "./filters/availability-filters"
import { ApplyFiltersButton } from "./filters/apply-filters-button"
import { MobileFilters } from "./filters/mobile-filters"

// This is a server component that wraps the client component
export function ProductFiltersWrapper() {
  return (
    <Suspense fallback={<FiltersLoadingSkeleton />}>
      <div className="hidden md:block">
        <div className="sticky top-24 rounded-lg border bg-white p-6">
          <FilterContent />
        </div>
      </div>
      <div className="md:hidden">
        <MobileFilters />
      </div>
    </Suspense>
  )
}

// Static content that doesn't use client hooks
function FilterContent() {
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

  return (
    <>
      <div>
        <h3 className="mb-4 text-sm font-semibold">Categories</h3>
        <CategoryFilters categories={categories} />
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="mb-4 text-sm font-semibold">Brands</h3>
        <BrandFilters brands={brands} />
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
        <PriceRangeFilter />
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="mb-4 text-sm font-semibold">Availability</h3>
        <AvailabilityFilters />
      </div>

      <div className="border-t pt-6 mt-6">
        <ApplyFiltersButton />
      </div>
    </>
  )
}

function FiltersLoadingSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <Skeleton className="h-8 w-24 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-6" />

      <Skeleton className="h-8 w-24 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-6" />

      <Skeleton className="h-8 w-24 mb-4" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
