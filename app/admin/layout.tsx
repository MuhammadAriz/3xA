"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Suspense } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Only check auth once to prevent infinite loops
        if (!authChecked) {
          const authenticated = await checkAuth()
          setAuthChecked(true)

          // If not authenticated and not already on login page, redirect to login
          if (!authenticated && pathname !== "/admin/login") {
            console.log("Not authenticated, redirecting to login")
            router.push("/admin/login")
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error)
        setAuthChecked(true)
      }
    }

    verifyAuth()
  }, [pathname, router, checkAuth, authChecked])

  // Show loading state
  if (isLoading && !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600"></div>
      </div>
    )
  }

  // If on login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // If not authenticated and not on login page, don't render anything yet
  if (!isAuthenticated && pathname !== "/admin/login" && !authChecked) {
    return null
  }

  return (
    <div className="flex min-h-screen pt-16">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </div>
    </div>
  )
}
