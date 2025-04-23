"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useFilters } from "@/contexts/filter-context"

export function AvailabilityFilters() {
  const { inStock, onDaraz, setInStock, setOnDaraz } = useFilters()

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="in-stock" checked={inStock} onCheckedChange={(checked) => setInStock(checked === true)} />
        <label htmlFor="in-stock" className="text-sm">
          In Stock
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="daraz-available" checked={onDaraz} onCheckedChange={(checked) => setOnDaraz(checked === true)} />
        <label htmlFor="daraz-available" className="text-sm">
          Available on Daraz
        </label>
      </div>
    </div>
  )
}
