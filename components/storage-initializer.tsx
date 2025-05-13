"use client"

import { useEffect, useState } from "react"
import { setupStorage } from "@/app/actions/setup-storage"

export default function StorageInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initStorage = async () => {
      try {
        const result = await setupStorage()
        if (!result.success) {
          console.warn("Storage initialization warning:", result.error)
        }
        setInitialized(true)
      } catch (err) {
        console.error("Storage initialization error:", err)
        setError(String(err))
      }
    }

    initStorage()
  }, [])

  // This component doesn't render anything visible
  return null
}
