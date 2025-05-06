"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide the loading overlay after a short delay
    const timer = setTimeout(() => {
      setVisible(false)
    }, 500) // Short delay to prevent flashing

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
        <p className="mt-2 text-sm text-gray-600">Loading content...</p>
      </div>
    </div>
  )
}
