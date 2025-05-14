"use client"

import { useEffect } from "react"
import { setupStorageBuckets } from "@/app/actions/storage-setup"

export default function StorageInitializer() {
  useEffect(() => {
    const initStorage = async () => {
      try {
        await setupStorageBuckets()
      } catch (err) {
        console.error("Failed to initialize storage:", err)
      }
    }

    initStorage()
  }, [])

  return null
}
