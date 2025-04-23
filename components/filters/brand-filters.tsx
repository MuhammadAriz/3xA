"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useFilters } from "@/contexts/filter-context"

export function BrandFilters({ brands }: { brands: { id: string; name: string }[] }) {
  const { brands: selectedBrands, setBrands } = useFilters()

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setBrands([...selectedBrands, brandId])
    } else {
      setBrands(selectedBrands.filter((id) => id !== brandId))
    }
  }

  return (
    <div className="space-y-3">
      {brands.map((brand) => (
        <div key={brand.id} className="flex items-center space-x-2">
          <Checkbox
            id={`brand-${brand.id}`}
            checked={selectedBrands.includes(brand.id)}
            onCheckedChange={(checked) => handleBrandChange(brand.id, checked === true)}
          />
          <label htmlFor={`brand-${brand.id}`} className="text-sm">
            {brand.name}
          </label>
        </div>
      ))}
    </div>
  )
}
