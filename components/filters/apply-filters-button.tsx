"use client"

import { Button } from "@/components/ui/button"
import { useFilters } from "@/contexts/filter-context"

export function ApplyFiltersButton() {
  const { applyFilters, resetFilters } = useFilters()

  return (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={applyFilters}>
        Apply Filters
      </Button>
      <Button variant="outline" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}
