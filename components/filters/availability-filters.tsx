"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function AvailabilityFilters() {
  return (
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
  )
}
