"use client"

import { useEffect, useState } from "react"
import { setupStorageBuckets } from "@/app/actions/storage-setup"

export default function StorageInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initStorage = async () => {
      try {
        const result = await setupStorageBuckets()
        if (result.success) {
          setInitialized(true)
        } else {
          console.warn("Storage initialization warning:", result.error)
          // Don't set error here as it's not critical for the app to function
        }
      } catch (err) {
        console.error("Failed to initialize storage:", err)
        // Don't set error here as it's not critical for the app to function
      }
    }

    initStorage()
  }, [])

  // This component doesn't render anything visible
  return null
}
