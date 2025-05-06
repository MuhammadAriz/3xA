"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { useSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

type Category = {
  id: number
  name: string
  slug: string
  description?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      setLoading(true)
      try {
        if (!supabase) {
          // Use mock data if Supabase is not available
          setCategories([
            { id: 1, name: "Electronics", slug: "electronics", description: "Electronic devices" },
            { id: 2, name: "Clothing", slug: "clothing", description: "Apparel and accessories" },
            { id: 3, name: "Home", slug: "home", description: "Home goods and furniture" },
          ])
          return
        }

        const { data, error } = await supabase.from("categories").select("*").order("name")

        if (error) {
          throw error
        }

        setCategories(data || [])
      } catch (error) {
        console.error("Error loading categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please try again.",
          variant: "destructive",
        })
        // Use mock data as fallback
        setCategories([
          { id: 1, name: "Electronics", slug: "electronics", description: "Electronic devices" },
          { id: 2, name: "Clothing", slug: "clothing", description: "Apparel and accessories" },
          { id: 3, name: "Home", slug: "home", description: "Home goods and furniture" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [supabase, toast])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  // Handle name change and auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = generateSlug(name)

    if (isEditing) {
      setEditingCategory({ ...editingCategory!, name, slug })
    } else {
      setNewCategory({ ...newCategory, name, slug })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!supabase) {
        toast({
          title: isEditing ? "Category Updated" : "Category Added",
          description: "This is a mock operation as Supabase is not connected.",
        })

        if (isEditing && editingCategory) {
          setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
        } else {
          const newId = Math.max(0, ...categories.map((c) => c.id)) + 1
          setCategories([...categories, { ...newCategory, id: newId }])
        }

        resetForm()
        return
      }

      if (isEditing && editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from("categories")
          .update({
            name: editingCategory.name,
            slug: editingCategory.slug,
            description: editingCategory.description,
          })
          .eq("id", editingCategory.id)

        if (error) throw error

        setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))

        toast({
          title: "Category Updated",
          description: `${editingCategory.name} has been updated successfully.`,
        })
      } else {
        // Add new category
        const { data, error } = await supabase.from("categories").insert([newCategory]).select()

        if (error) throw error

        setCategories([...categories, data[0]])

        toast({
          title: "Category Added",
          description: `${newCategory.name} has been added successfully.`,
        })
      }

      resetForm()
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Edit category
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsEditing(true)
  }

  // Delete category
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      if (!supabase) {
        setCategories(categories.filter((cat) => cat.id !== id))
        toast({
          title: "Category Deleted",
          description: "This is a mock operation as Supabase is not connected.",
        })
        return
      }

      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      setCategories(categories.filter((cat) => cat.id !== id))

      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Reset form
  const resetForm = () => {
    setNewCategory({ name: "", slug: "", description: "" })
    setEditingCategory(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Category" : "Add New Category"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update the category details below" : "Create a new category for your products"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={isEditing ? editingCategory?.name : newCategory.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={isEditing ? editingCategory?.slug : newCategory.slug}
                  onChange={(e) =>
                    isEditing
                      ? setEditingCategory({ ...editingCategory!, slug: e.target.value })
                      : setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                  placeholder="e.g. electronics"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={isEditing ? editingCategory?.description || "" : newCategory.description}
                onChange={(e) =>
                  isEditing
                    ? setEditingCategory({ ...editingCategory!, description: e.target.value })
                    : setNewCategory({ ...newCategory, description: e.target.value })
                }
                placeholder="Brief description of the category"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{isEditing ? "Update Category" : "Add Category"}</Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500">No categories found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setNewCategory({ name: "", slug: "", description: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add your first category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
