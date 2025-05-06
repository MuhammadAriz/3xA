"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, Tag, Database } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Products", path: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Customers", path: "/admin/customers", icon: <Users className="h-5 w-5" /> },
    { name: "Categories", path: "/admin/categories", icon: <Tag className="h-5 w-5" /> },
    { name: "Database", path: "/admin/database-setup", icon: <Database className="h-5 w-5" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="h-full w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-1 px-2 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive(item.path) ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
