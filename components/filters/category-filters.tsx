"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useFilters } from "@/contexts/filter-context"

export function CategoryFilters({ categories }: { categories: { id: string; name: string }[] }) {
  const { categories: selectedCategories, setCategories } = useFilters()

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setCategories([...selectedCategories, categoryId])
    } else {
      setCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <Checkbox
            id={`category-${category.id}`}
            checked={selectedCategories.includes(category.id)}
            onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
          />
          <label htmlFor={`category-${category.id}`} className="text-sm">
            {category.name}
          </label>
        </div>
      ))}
    </div>
  )
}
