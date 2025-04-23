"use client"

import { Slider } from "@/components/ui/slider"
import { useFilters } from "@/contexts/filter-context"

export function PriceRangeFilter() {
  const { priceRange, setPriceRange } = useFilters()

  return (
    <>
      <Slider
        defaultValue={[0, 1000]}
        max={1000}
        step={10}
        value={priceRange}
        onValueChange={setPriceRange}
        className="py-4"
      />
      <div className="mt-2 flex items-center justify-between text-sm">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </>
  )
}
