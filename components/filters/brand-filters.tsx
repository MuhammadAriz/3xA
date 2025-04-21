"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function BrandFilters({ brands }: { brands: { id: string; name: string }[] }) {
  return (
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
  )
}
