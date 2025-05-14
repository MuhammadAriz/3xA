"use server"

import { createClient } from "@supabase/supabase-js"

// Simple function to check storage status
export async function checkStorageStatus() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      return {
        success: false,
        error: error.message,
        message: "Could not check storage configuration.",
      }
    }

    const productImagesBucketExists = buckets?.some((bucket) => bucket.name === "product-images")

    if (!productImagesBucketExists) {
      return {
        success: false,
        error: "Bucket does not exist",
        message: "The product-images bucket does not exist.",
      }
    }

    return {
      success: true,
      message: "Storage is properly configured.",
    }
  } catch (error) {
    return {
      success: false,
      error: String(error),
      message: "Error checking storage configuration.",
    }
  }
}

// Export the function that's referenced elsewhere
export async function setupStorageBuckets() {
  return await checkStorageStatus()
}
