"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function PriceRangeFilter() {
  const [priceRange, setPriceRange] = useState([0, 1000])

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
