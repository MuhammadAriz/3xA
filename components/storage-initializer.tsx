"use client"

import { useEffect, useState } from "react"
import { checkStorageStatus } from "@/app/actions/storage-setup"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function StorageInitializer() {
  const [status, setStatus] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true)
        const result = await checkStorageStatus()
        setStatus(result)
      } catch (error) {
        console.error("Error initializing storage:", error)
        setStatus({
          success: false,
          error: String(error),
          message: "Failed to check storage status. Using fallback image storage.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeStorage()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        <span>Checking storage configuration...</span>
      </div>
    )
  }

  if (!status) return null

  return (
    <div className="mb-4">
      {status.success ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Storage Ready</AlertTitle>
          <AlertDescription className="text-green-700">{status.message}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Configuration Issue</AlertTitle>
          <AlertDescription>
            <p>{status.message}</p>
            <p className="mt-2">
              <Link href="/admin/debug" className="font-medium underline">
                View storage setup guide
              </Link>
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
