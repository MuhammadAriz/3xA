"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
}

export default function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  const [visible, setVisible] = useState(isLoading)

  useEffect(() => {
    // Hide the loading overlay after a short delay
    setVisible(isLoading)
  }, [isLoading])

  if (!visible) return <>{children}</>

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
        <p className="mt-2 text-sm text-gray-600">Loading content...</p>
      </div>
    </div>
  )
}
