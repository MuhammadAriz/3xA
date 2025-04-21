"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function CategoryFilters({ categories }: { categories: { id: string; name: string }[] }) {
  return (
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
  )
}
