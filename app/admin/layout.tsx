"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Suspense } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = await checkAuth()

      // If not authenticated and not on login page, redirect to login
      if (!authenticated && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }

    verifyAuth()
  }, [pathname, router, checkAuth])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
      </div>
    )
  }

  // If not authenticated, don't render the admin layout
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  // If on login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </div>
  )
}
