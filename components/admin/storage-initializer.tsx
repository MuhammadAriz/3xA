"use client"

import { useState, useEffect } from "react"
import { setupStorageBuckets } from "@/app/actions/storage-setup"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function StorageInitializer() {
  const [status, setStatus] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const result = await setupStorageBuckets()
        setStatus(result)
      } catch (error) {
        console.error("Error initializing storage:", error)
        setStatus({
          success: false,
          message: "Error initializing storage. Using fallback image storage.",
          error: String(error),
        })
      }
    }

    initializeStorage()
  }, [])

  if (!status || status.success) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  )
}
